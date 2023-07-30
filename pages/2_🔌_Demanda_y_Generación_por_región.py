import requests
import streamlit as st
from datetime import datetime as dt
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go


api_regiones_demanda = 'https://api.cammesa.com/demanda-svc/demanda/RegionesDemanda'
api_demanda_temp = 'https://api.cammesa.com/demanda-svc/demanda/ObtieneDemandaYTemperaturaRegion?id_region='
api_generacion = 'https://api.cammesa.com/demanda-svc/generacion/ObtieneGeneracioEnergiaPorRegion?id_region='

st.write("""
# Demanda y Generación de energía por región

A continuación, mostramos los datos del día de demanda y generación energética según provenientes de Cammesa.
Estos datos nos ayudarán visualizar en vivo el estado general en todas las regiones o en alguna en particular.
""")


st.header("Demanda")
st.caption(dt.now().strftime("Última actualización: %d/%m/%Y, a las %H:%M"))

response = requests.get(api_regiones_demanda)
regiones = list(response.json())

option = st.selectbox(
    label='Elige una región para visualizar',
    options=(region['nombre'] for region in regiones),
    index=len(regiones) - 1,
    placeholder='Selecciona o escriba el nombre de la región...'
)

region_selected = next(region for region in regiones if region['nombre'] == option)
response_dem = requests.get(api_demanda_temp + str(region_selected.get('id')))
if response_dem.status_code == 200:
    demanda = list(response_dem.json())
    df_demanda = pd.DataFrame(demanda)
    df_demanda['fecha'] = pd.to_datetime(df_demanda['fecha'])
    st.dataframe(df_demanda)

    fig = go.Figure()
    if "demHoy" in df_demanda:
        fig.add_trace(go.Scatter(
            x=df_demanda["fecha"],
            y=df_demanda["demHoy"],
            name='Demanda Hoy',
            connectgaps=True,
            mode='lines'
        ))
    if "demAyer" in df_demanda:
        fig.add_trace(go.Scatter(
            x=df_demanda["fecha"],
            y=df_demanda["demAyer"],
            name='Demanda Ayer',
            connectgaps=True,
            mode='lines'
        ))
    if "demSemanaAnt" in df_demanda:
        fig.add_trace(go.Scatter(
            x=df_demanda["fecha"],
            y=df_demanda["demSemanaAnt"],
            name='Demanda Semana Anterior',
            connectgaps=True,
            mode='lines'
        ))
    if "demPrevista" in df_demanda:
        fig.add_trace(go.Scatter(
            x=df_demanda["fecha"],
            y=df_demanda["demPrevista"],
            name='Demanda Prevista',
            connectgaps=True,
            mode='lines'
        ))
    fig.update_layout(legend=dict(orientation='h', yanchor='top', y=1.1, xanchor='right', x=1))
    fig.update_layout(
        title="Gráfico de Demanda",
        xaxis_title="Hora del día [HH:MM]",
        yaxis_title="Valor de Demanda [MW]"
    )
    st.plotly_chart(fig, theme="streamlit", use_container_width=True)

    fig2 = go.Figure()
    if "tempHoy" in df_demanda:
        fig2.add_trace(go.Scatter(
            x=df_demanda["fecha"],
            y=df_demanda["tempHoy"],
            name='Temperatura Hoy',
            connectgaps=True,
            mode='lines+markers'  # TODO: Revisar este param para hora 00 hasta hora 01
        ))
    if "tempAyer" in df_demanda:
        fig2.add_trace(go.Scatter(
            x=df_demanda["fecha"],
            y=df_demanda["tempAyer"],
            name='Temperatura Ayer',
            connectgaps=True,
            mode='lines'
        ))
    if "tempSemanaAnt" in df_demanda:
        fig2.add_trace(go.Scatter(
            x=df_demanda["fecha"],
            y=df_demanda["tempSemanaAnt"],
            name='Temperatura Semana Anterior',
            connectgaps=True,
            mode='lines'
        ))
    if "tempPrevista" in df_demanda:
        fig2.add_trace(go.Scatter(
            x=df_demanda["fecha"],
            y=df_demanda["tempPrevista"],
            name='Temperatura Prevista',
            connectgaps=True,
            mode='markers'
        ))
    fig2.update_layout(legend=dict(orientation='h', yanchor='top', y=1.1, xanchor='right', x=1))
    fig2.update_layout(
        title="Gráfico de Temperatura",
        xaxis_title="Hora del día [HH:MM]",
        yaxis_title="Valor de Temperatura [°C]"
    )
    st.plotly_chart(fig2, theme="streamlit", use_container_width=True)
