#!/bin/sh
sh run.sh --file archives/cc-orig-windows.tar.gz --platform windows
sh run.sh --file archives/cc-orig-windows.tar.gz --platform windows --bundle-crossedeyes
sh run.sh --file archives/cc-orig-linux.tar.gz --platform linux --nwjs archives/nwjs-v0.72.0-linux-x64.tar.gz
sh run.sh --file archives/cc-orig-linux.tar.gz --platform linux --nwjs archives/nwjs-v0.72.0-linux-x64.tar.gz --bundle-crossedeyes
