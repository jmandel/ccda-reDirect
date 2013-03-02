# SMART reDirect

## A simple service to:
 1. Listen for incoming messages on a Direct server
 2. Identify C-CCDA attachments, and
 3. Forward them to a specified address.

This is a quick hack and a useful bridge.  Currently relies on the Direct Java
Reference Implemenation version 2.1, with the `IncomingMessageSaveFolder` debug
setting enabled.  It works by monitoring a directory for new (e-mail) files.

Run it with three variables (passed via the command line, or as environment variables):

* HTTP Host (base URI to which files should be posted): `--http_host` or `export HTTP_HOST`
* Source Directory (local dir where new e-mail files appear): `--source_dir` or `export SOURCE_DIR`
* Progress Directory (local dir where progress can be recorded): `--progress_dir` or `export PROGRESS_DIR`

---

This is designed to run in the context of a SMART Direct/C-CDA Trifecta.  You
can install the whole shebang automatically with [ansible](http://ansible.cc):

https://github.com/jmandel/ansible-ccda


