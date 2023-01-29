#!/bin/bash -e

sudo_cmd=""
if [ "$(id -u)" != "0" ]; then
    sudo_cmd="sudo"
fi

# install openvpn client
export DEBIAN_FRONTEND=noninteractive
${sudo_cmd} apt-get update
${sudo_cmd} apt-get -y install --no-install-recommends openvpn
${sudo_cmd} apt-get clean
${sudo_cmd} rm -rf /var/lib/apt/lists/* /tmp/library-scripts

# Remove the OPENVPN_CONFIG variable since we don't neeed it after is written to a file
${sudo_cmd} echo 'OPENVPN_CONFIG=""' >> /etc/environment
${sudo_cmd} echo "unset OPENVPN_CONFIG" | tee -a /etc/bash.bashrc > /etc/profile.d/999-unset-openvpn-config.sh
if [ -d "/etc/zsh" ]; then
    ${sudo_cmd} echo "unset OPENVPN_CONFIG" >> /etc/zsh/zshenv
fi
