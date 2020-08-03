#!/usr/bin/env sh
apt update
DEBIAN_FRONTEND=noninteractive apt install -y python-zmq python-systemd python-tornado salt-common salt-master salt-minion

LOCAL_IPv4=$(ip addr | grep -E -o '10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')

cat <<EOF >/etc/salt/master.d/listen-interface.conf
interface: ${LOCAL_IPv4}
EOF

cat <<EOF >/etc/salt/minion.d/salt-master.conf
master: 127.0.0.1
EOF

mkdir -p /srv/salt/_grains

cat <<EOF >/srv/salt/_grains/packet_metadata.py
{{ &PACKET_METADATA_PY }}
EOF
