FROM garethflowers/ftp-server

ENV FTP_BASE_PATH=/files/

COPY [ "/src/docker-entrypoint.sh", "/" ]

RUN chmod +x docker-entrypoint.sh

# CMD ["/usr/sbin/run-vsftpd.sh"]
ENTRYPOINT [ "/docker-entrypoint.sh" ]