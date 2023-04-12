FROM lsk569937453/silverwind:0.0.6
COPY app_config.yaml /tmp/app_config.yaml
COPY build /tmp/build
RUN chmod go+r /tmp/silverwind
ENV CONFIG_FILE_PATH=/tmp/app_config.yaml
ENV ADMIN_PORT=4560
WORKDIR "/tmp"
ENTRYPOINT ["/tmp/silverwind"]

