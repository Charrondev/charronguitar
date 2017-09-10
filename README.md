# charronguitar.com

Website for charronguitar.

Server is run with Caddy.

I read the following guides as I prepared this server:

https://denbeke.be/blog/servers/running-caddy-server-as-a-service-with-systemd/
http://nondisplayable.ca/2016/09/20/basic-caddy-setup.html

## Installation

1. Copy the caddy config to to `/root/www/Caddyfile`
1. Copy the systemd config to `/etc/systemd/system/caddy.service`
1. run `sudo systemctl enable caddy`
1. run `systemctl daemon-reload`
1. Now you can start Caddy using sudo service caddy start. And of course stop, restart, …
1. You can view the status of your service using sudo service caddy status.

Server caddy config:

```
charronguitar.com
gzip
errors charronguitar/logs/error.log
log charronguitar/logs/access.log
root charronguitar/dist
tls adam@charrondev.com
git {
    repo git@github.com:Charrondev/charronguitar
    hook /utility/deploy "EatBre@kfast6505"
    key      /root/.ssh/id_rsa
    path ../
}
```

Caddy Systemd configuration.
```
[Unit]
Description=Caddy Web Server
Documentation=http://caddyserver.com
After=network.target

[Service]
User=root
WorkingDirectory=/root/www
LimitNOFILE=8192
ExecStart=/usr/local/bin/caddy -agree -email adam@charrondev.com
Restart=on-failure
StartLimitInterval=600
Environment=HOME=/root/www

[Install]
WantedBy=multi-user.target
```

