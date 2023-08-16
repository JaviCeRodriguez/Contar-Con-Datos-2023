import streamlit as st
import requests
import seaborn as sns
import pandas as pd
import warnings
import plotly.express as px

st.set_page_config(
    page_title="Inicio",
    page_icon="🏠",
    layout="wide",
)


def convert_to_timedelta(time_str):
    if isinstance(time_str, str):
        parts = time_str.replace(',', '.').split('.')
        if len(parts) == 2:
            hour, minute = map(int, parts)
            total_minutes = hour * 60 + minute
            return pd.to_timedelta(f'{total_minutes} minutes')
    return pd.NaT


sns.set(rc={'figure.figsize':(20, 6)})
warnings.filterwarnings('ignore')
colores = {
    'eolicas': 'green',
    'hidraulica': 'blue',
    'nuclear': 'orange',
    'solar': 'pink',
    'termicas': 'red',
}

st.title('Análisis de consumo energético vía CAMMESA')

st.write("""
## Propósito del trabajo

Este trabajo busca entender la distribución energética argentina, con el fin de descubrir posibles patrones de interés.
Para esto se realizará un análisis exploratorio de datos obtenidos a través de la web de CAMESSA, utilizando su API y
datos disponibles que ofrecen abiertamente. 
""")

st.divider()

st.write("""
## KPI - Un breve resumen con datos

Observemos las métricas destacadas de hoy y de los registros históricos
""")

col1_today, col2_today = st.columns(2)
api_regiones_demanda = 'https://api.cammesa.com/demanda-svc/demanda/RegionesDemanda'
api_demanda_temp = 'https://api.cammesa.com/demanda-svc/demanda/ObtieneDemandaYTemperaturaRegion?id_region='
api_generacion = 'https://api.cammesa.com/demanda-svc/generacion/ObtieneGeneracioEnergiaPorRegion?id_region='

response = requests.get(api_regiones_demanda)
regiones = list(response.json())

option = st.sidebar.selectbox(
    key='demanda-options',
    label='Elige una región para visualizar',
    options=(region['nombre'] for region in regiones),
    index=len(regiones) - 1,
    placeholder='Selecciona o escriba el nombre de la región...'
)


region_selected = next(region for region in regiones if region['nombre'] == option)

with col1_today:
    st.write(f"### Demanda de {region_selected.get('nombre')} (ahora)")

    response_dem = requests.get(api_demanda_temp + str(region_selected.get('id')))

    if response_dem.status_code == 200:
        demanda = list(response_dem.json())
        df_demanda = pd.DataFrame(demanda)
        df_demanda['fecha'] = pd.to_datetime(df_demanda['fecha'])
        # Para asegurar la visibilidad de KPIs, eliminamos todos los datos nulos
        df_demanda.dropna(inplace=True)
        last_row_dem = df_demanda.iloc[-1]

        if last_row_dem.empty or df_demanda.empty:
            st.write("No hay datos suficientes para mostrar este KPI")

        if len(last_row_dem) > 0:
            col1_m1, col1_m2 = st.columns(2)
            col1_m3, _ = st.columns(2)

            if 'demHoy' in last_row_dem.index and 'demAyer' in last_row_dem.index:
                diff_m1_1 = round(last_row_dem['demHoy'] - last_row_dem['demAyer'], 3)
                col1_m1.metric(
                    label="Demanda hoy vs ayer",
                    value=f"{last_row_dem['demHoy']} GW",
                    delta=f"{diff_m1_1} GW",
                    delta_color="inverse"
                )

            if 'demHoy' in last_row_dem.index and 'demPrevista' in last_row_dem.index:
                diff_m1_2 = round(last_row_dem['demHoy'] - last_row_dem['demPrevista'], 3)
                col1_m2.metric(
                    label="Demanda hoy vs prevista",
                    value=f"{last_row_dem['demHoy']} GW",
                    delta=f"{diff_m1_2} GW",
                    delta_color="inverse"
                )

            if 'tempHoy' in last_row_dem.index and 'tempAyer' in last_row_dem.index:
                diff_m1_3 = round(last_row_dem['tempHoy'] - last_row_dem['tempAyer'], 3)
                col1_m3.metric(
                    label="Temperatura hoy vs ayer",
                    value=f"{last_row_dem['tempHoy']} °C",
                    delta=f"{diff_m1_3} °C",
                    delta_color="inverse"
                )

            with st.expander("Ver datos de demanda"):
                st.dataframe(df_demanda)

with col2_today:
    st.write(f"### Generación de {region_selected.get('nombre')} (ahora)")

    response_gen = requests.get(api_generacion + str(region_selected.get('id')))
    if response_dem.status_code == 200:
        generacion = list(response_gen.json())

        if len(generacion) == 0:
            st.write("No hay datos disponibles para mostrar este KPI")

        if len(generacion) > 0:
            df_generacion = pd.DataFrame(generacion)
            df_generacion['fecha'] = pd.to_datetime(df_generacion['fecha'])
            # Para asegurar la visibilidad de KPIs, eliminamos todos los datos nulos
            df_generacion.dropna(inplace=True)
            last_row_gen_1 = df_generacion.iloc[-1]
            last_row_gen_2 = df_generacion.iloc[-2]

            if last_row_gen_1.empty or last_row_gen_2.empty or df_generacion.empty:
                st.write("No hay datos suficientes para mostrar este KPI")

            col2_m1, col2_m2 = st.columns(2)
            col2_m3, col2_m4 = st.columns(2)

            if 'hidraulico' in last_row_gen_1.index and 'hidraulico' in last_row_gen_2.index:
                diff_m2_1 = round(last_row_gen_1['hidraulico'] - last_row_gen_2['hidraulico'], 3)
                col2_m1.metric(
                    label="💧 Hidráulico",
                    value=f"{last_row_gen_1['hidraulico']} GW",
                    delta=f"{diff_m2_1} GW",
                )

            if 'termico' in last_row_gen_1.index and 'termico' in last_row_gen_2.index:
                diff_m2_2 = round(last_row_gen_1['termico'] - last_row_gen_2['termico'], 3)
                col2_m2.metric(
                    label="🌡️ Térmico",
                    value=f"{last_row_gen_1['termico']} GW",
                    delta=f"{diff_m2_2} GW",
                )

            if 'nuclear' in last_row_gen_1.index and 'nuclear' in last_row_gen_2.index:
                diff_m2_3 = round(last_row_gen_1['nuclear'] - last_row_gen_2['nuclear'], 3)
                col2_m3.metric(
                    label="☢️ Nuclear",
                    value=f"{last_row_gen_1['nuclear']} GW",
                    delta=f"{diff_m2_3} GW",
                )

            if 'renovable' in last_row_gen_1.index and 'renovable' in last_row_gen_2.index:
                diff_m2_4 = round(last_row_gen_1['renovable'] - last_row_gen_2['renovable'], 3)
                col2_m4.metric(
                    label="🍃 Renovable",
                    value=f"{last_row_gen_1['renovable']} GW",
                    delta=f"{diff_m2_4} GW",
                )

            with st.expander("Ver datos de generación"):
                st.dataframe(df_generacion)

st.divider()

st.write("### Datos históricos")

dataset_url = "https://raw.githubusercontent.com/JaviCeRodriguez/Contar-Con-Datos-2023/main/eda/data/cammesa/maximos_historicos.csv"

# read csv from a URL y mantengo en cache
@st.cache_data
def get_data() -> pd.DataFrame:
    return pd.read_csv(dataset_url)

df_historic = get_data()
st.write(df_historic.head())
anus = list(df_historic['AÑO'].unique())

option_2 = st.sidebar.selectbox(
    key='años',
    label='Elige un año para visualizar',
    options=anus,
    index=len(anus) - 1,
    placeholder='Selecciona el año'
)

# Filtrar los datos por el año seleccionado
selected_year_data = df_historic[df_historic['AÑO'] == option_2]

# Convertir la columna 'Hora Potencia Pico' a tipo numérico (eliminar las comas y convertir a float)
selected_year_data['Hora Potencia Pico'] = selected_year_data['Hora Potencia Pico'].str.replace(',', '').astype(float)

# Crear el gráfico de barras
st.write(f'## Gráfico de Potencia Pico SADI (MW) por Fecha para el año {option_2}')
fig = px.bar(selected_year_data, x='FECHA', y='Potencia Pico SADI (MW)', title='Hora Potencia Pico SADI (MW) por Fecha')
fig.update_layout(
    xaxis_title='Fecha',
    yaxis_title='Potencia Pico SADI (MW)',
    title_x=0.5,  # Centrar el título
    font=dict(family='Arial', size=14),  # Personalizar la fuente del texto
    plot_bgcolor='black',  # Color de fondo del gráfico
)
st.plotly_chart(fig, use_container_width=True, theme='streamlit')

st.write("""
Picos de potencia cada 4 días, comienzo en 1/1/2023
""")

max_row = selected_year_data[selected_year_data['Potencia Pico SADI (MW)'] == selected_year_data['Potencia Pico SADI (MW)'].max()]
min_row = selected_year_data[selected_year_data['Potencia Pico SADI (MW)'] == selected_year_data['Potencia Pico SADI (MW)'].min()]

max_power = max_row['Potencia Pico SADI (MW)'].values[0]
min_power = min_row['Potencia Pico SADI (MW)'].values[0]
max_hour = max_row['Hora Potencia Pico'].values[0]
min_hour = min_row['Hora Potencia Pico'].values[0]

colum_1, colum_2 = st.columns(2)

with colum_1:
    st.metric(label='Potencia Pico Máxima (MW)', value=max_power)
    st.metric(label='Hora Potencia Pico Máxima', value=max_hour)

with colum_2:
    st.metric(label='Potencia Pico Mínima (MW)', value=min_power)
    st.metric(label='Hora Potencia Pico Mínima', value=min_hour)