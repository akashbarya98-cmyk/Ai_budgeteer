#!/bin/bash
# Double-fork daemonizer to keep the dev server alive across shell sessions.
cd /home/z/my-project

# Kill any existing next dev
pkill -f "next dev" 2>/dev/null
sleep 1

# Double-fork: parent exits, child reparents to init, grandchild runs the server
nohup bash -c '
  # Second fork
  ( node_modules/.bin/next dev -p 3000 ) > dev.log 2>&1
' </dev/null >/dev/null 2>&1 &

disown 2>/dev/null
echo "daemon launched"
