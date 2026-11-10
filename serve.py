#!/usr/bin/env python3
"""
Lightweight Local Preview Server for Product Designer Portfolio.
Zero dependencies. Uses Python standard library with multithreading and HTTP Range support for video streaming.
"""

import http.server
import socketserver
import os
import re

PORT = 3001
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        range_header = self.headers.get("Range")
        if not range_header:
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        file_len = fs.st_size

        m = re.match(r"bytes=(\d+)-(\d*)", range_header)
        if not m:
            f.close()
            return super().send_head()

        start = int(m.group(1))
        end = int(m.group(2)) if m.group(2) else file_len - 1

        if start >= file_len:
            f.close()
            self.send_error(416, "Requested Range Not Satisfiable")
            return None

        end = min(end, file_len - 1)
        length = end - start + 1

        self.send_response(206)
        ctype = self.guess_type(path)
        self.send_header("Content-type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_len}")
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.end_headers()

        f.seek(start)
        self._range_remaining = length
        return f

    def copyfile(self, source, outputfile):
        remaining = getattr(self, "_range_remaining", None)
        if remaining is None:
            try:
                super().copyfile(source, outputfile)
            except (ConnectionResetError, BrokenPipeError):
                pass
            return

        bufsize = 64 * 1024
        try:
            while remaining > 0:
                chunk = source.read(min(bufsize, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                remaining -= len(chunk)
        except (ConnectionResetError, BrokenPipeError):
            pass

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")


class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def run_server():
    os.chdir(DIRECTORY)
    with ThreadingHTTPServer(("", PORT), RangeHTTPRequestHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n=======================================================")
        print(f"  Product Designer Portfolio — Local Preview Server")
        print(f"  Serving at: {url}")
        print(f"  Press Ctrl+C to stop the server")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")


if __name__ == "__main__":
    run_server()
