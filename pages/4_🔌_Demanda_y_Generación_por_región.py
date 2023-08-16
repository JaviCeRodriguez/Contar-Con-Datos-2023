import requests
import streamlit as st
from datetime import datetime as dt
import pandas as pd
import plotly.graph_objects as go

st.set_page_config(
    page_title="Demanda y Generación",
    page_icon="🔌",
    layout="wide",
)

api_regiones_demanda = 'https://api.cammesa.com/demanda-svc/demanda/RegionesDemanda'
api_demanda_temp = 'https://api.cammesa.com/demanda-svc/demanda/ObtieneDemandaYTemperaturaRegion?id_region='
api_generacion = 'https://api.cammesa.com/demanda-svc/generacion/ObtieneGeneracioEnergiaPorRegion?id_region='

st.write("""
# Demanda y Generación de energía por región

A continuación, mostramos los datos del día de demanda y generación energética según provenientes de Cammesa.
Estos datos nos ayudarán visualizar en vivo el estado general en todas las regiones o en alguna en particular.
""")


st.header("Demanda")
st.caption(dt.now().strftime("Última actualización de demanda: %d/%m/%Y, a las %H:%M"))

response = requests.get(api_regiones_demanda)
regiones = list(response.json())

option = st.selectbox(
    key='demanda-options',
    label='Elige una región para desplegar los datos de demanda utilizados en las visualizaciones',
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

    st.write("""
    Demanda energética a lo largo del día en la región seleccionada
    """)

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

st.write("""
Temperatura a lo largo del día en la región seleccionada
""")

st.header("Generación")
st.caption(dt.now().strftime("Última actualización de generación: %d/%m/%Y, a las %H:%M"))

option2 = st.selectbox(
    key='generacion-options',
    label='Elige una región para desplegar los datos de generación utilizados en las visualizaciones',
    options=(region['nombre'] for region in regiones),
    index=len(regiones) - 1,
    placeholder='Selecciona o escriba el nombre de la región...'
)

region_selected = next(region for region in regiones if region['nombre'] == option2)
response_gen = requests.get(api_generacion + str(region_selected.get('id')))
if response_dem.status_code == 200:
    generacion = list(response_gen.json())
    if len(generacion) > 0:
        df_generacion = pd.DataFrame(generacion)
        df_generacion['fecha'] = pd.to_datetime(df_generacion['fecha'])
        st.dataframe(df_generacion)

        total = st.checkbox('Ver total de generación en el gráfico')

        fig3 = go.Figure()
        fig3.add_trace(go.Scatter(
            x=df_generacion["fecha"],
            y=df_generacion["termico"],
            name='🌡️ Térmico',
            fill='tozeroy',
            line_color='red'
        ))
        fig3.add_trace(go.Scatter(
            x=df_generacion["fecha"],
            y=df_generacion["hidraulico"],
            name='💧 Hidráulico',
            fill='tozeroy',
            line_color='blue'
        ))
        fig3.add_trace(go.Scatter(
            x=df_generacion["fecha"],
            y=df_generacion["renovable"],
            name='🍃 Renovable',
            fill='tozeroy',
            line_color='green'
        ))
        fig3.add_trace(go.Scatter(
            x=df_generacion["fecha"],
            y=df_generacion["nuclear"],
            name='☢️ Nuclear',
            fill='tozeroy',
            line_color='orange'
        ))
        if total:
            fig3.add_trace(go.Scatter(
                x=df_generacion["fecha"],
                y=df_generacion["sumTotal"],
                name='Total',
                line_color='pink'
            ))
        fig3.update_layout(legend=dict(orientation='h', yanchor='top', y=1.1, xanchor='right', x=1))
        fig3.update_layout(
            title="Gráfico de Generación",
            xaxis_title="Hora del día [HH:MM]",
            yaxis_title="Valor de Generación [MW]"
        )
        st.plotly_chart(fig3, theme="streamlit", use_container_width=True)
    else:
        st.write(f'En la región **{region_selected.get("nombre")}** no hay generación de energía!')

