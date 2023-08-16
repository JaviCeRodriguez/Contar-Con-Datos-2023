import streamlit as st
import requests
import seaborn as sns
import pandas as pd
import warnings
import matplotlib.pyplot as plt
from io import StringIO
import plotly.express as px
from datetime import datetime, timedelta


st.set_page_config(
    page_title="Datos históricos de potencia pico",
    page_icon="👴",
    layout="wide",
)


def format_time(value):
    try:
        value = value.replace(',', '.')
        time_obj = datetime.strptime(value, '%H.%M')
        return time_obj.strftime('%H:%M')
    except:
        return None


def combine_date_time(row):
    try:
        fecha_obj = datetime.strptime(row['FECHA'], '%d/%m/%Y')
        hora_obj = datetime.strptime(row['hora_formateada'], '%H:%M')
        combined_datetime = fecha_obj.replace(hour=hora_obj.hour, minute=hora_obj.minute)
        return combined_datetime
    except:
        return None


@st.cache_data
def get_data() -> pd.DataFrame:
    data = pd.read_csv('./eda/data/cammesa/maximos_historicos.csv')
    data['Energía SADI (GWh)'] = data['Energía SADI (GWh)'].str.replace(',', '.').astype(float)
    data['Potencia Pico SADI (MW)'] = data['Potencia Pico SADI (MW)'].str.replace(',', '.').astype(float)
    data['Temperatura Media Diaria GBA  (°C)'] = data['Temperatura Media Diaria GBA  (°C)'].str.replace(',', '.').astype(float)
    data['hora_formateada'] = data['Hora Potencia Pico'].apply(format_time)
    data['FECHA y HORA'] = data.apply(combine_date_time, axis=1)
    return data


st.title('Datos históricos de potencia pico')

df_maximos = get_data()
with st.expander("Ver datos históricos"):
    st.dataframe(df_maximos)

tipo_dia = st.sidebar.multiselect(
    options=df_maximos['TIPO DIA'].unique(),
    default=df_maximos['TIPO DIA'].unique(),
    label="Seleccionar tipo de día",
)

df_filter = df_maximos[df_maximos['TIPO DIA'].isin(tipo_dia)]

st.subheader("Evolución de generación de energía a lo largo de los años")
fig = px.scatter(
    df_filter,
    x='FECHA y HORA',
    y='Energía SADI (GWh)',
    color="VERANO / INVIERNO"
)
fig.update_layout(
    xaxis_title='Años',
    yaxis_title='Energía SADI (GWh)',
    title='Evolución de generación de energía a lo largo de los años',
)
st.plotly_chart(fig, use_container_width=True, theme='streamlit')

st.subheader("Evolución de la potencia pico a lo largo de los años")
fig = px.scatter(
    df_filter,
    x='FECHA y HORA',
    y='Potencia Pico SADI (MW)',
    color="VERANO / INVIERNO"
)
fig.update_layout(
    xaxis_title='Años',
    yaxis_title='Potencia Pico SADI (MW)',
    title='Evolución de la potencia pico a lo largo de los años',
)
st.plotly_chart(fig, use_container_width=True, theme='streamlit')


st.subheader("Temperatura media en los momentos pico (en GBA)")
fig = px.scatter(
    df_filter,
    x='FECHA y HORA',
    y='Temperatura Media Diaria GBA  (°C)',
    color="VERANO / INVIERNO"
)
fig.update_layout(
    xaxis_title='Años',
    yaxis_title='Temperatura Media Diaria GBA  (°C)',
    title='Temperatura media en los momentos pico (en GBA)',
)
st.plotly_chart(fig, use_container_width=True, theme='streamlit')
