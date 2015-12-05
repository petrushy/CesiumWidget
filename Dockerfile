FROM andrewosh/binder-base

USER main

# TODO: change this to `petrushy`
RUN git clone https://github.com/bollwyvl/CesiumWidget.git --depth=1

WORKDIR CesiumWidget

RUN pip install .
RUN jupyter nbextension install CesiumWidget --user
