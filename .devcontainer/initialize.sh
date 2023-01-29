#!/bin/bash -e

# install openvpn client
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y install --no-install-recommends openvpn \
apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/library-scripts \

sudo_cmd=""
if [ "$(id -u)" != "0" ]; then
    sudo_cmd="sudo"
fi

# Remove the OPENVPN_CONFIG variable since we don't neeed it after is written to a file
${sudo_cmd} echo 'OPENVPN_CONFIG=""' >> /etc/environment
${sudo_cmd} echo "unset OPENVPN_CONFIG" | tee -a /etc/bash.bashrc > /etc/profile.d/999-unset-openvpn-config.sh
if [ -d "/etc/zsh" ]; then
    ${sudo_cmd} echo "unset OPENVPN_CONFIG" >> /etc/zsh/zshenv
fi
