import streamlit as st

st.set_page_config(
    page_title="Nosotros",
    page_icon="😀",
    layout="wide",
)

st.header("😀 Sobre nosotros")
st.write("""
Somos tres estudiantes de la Licenciatura en Ciencia de Datos en UNSAM, e hicimos este presentación de datos para aplicar nuestro
aprendizaje adquirido en el primer año de la carrera. Agradecemos al equipo de Rodrigo Díaz por alentarnos a participar y demostrar
que con datos podemos hacer muchas cosas interesantes! 😄
""")

col1, col2, col3 = st.columns(3)

col1.subheader("Lucas Oliaro Vera")
col1.write("""
[GitHub](https://github.com/lucas-oliaro) - [LinkedIn](https://www.linkedin.com/in/lucas-oliaro/)
""")
col1.image("https://avatars.githubusercontent.com/u/81052967?v=4")

col2.subheader("Javier Rodriguez")
col2.write("""
[GitHub](https://github.com/JaviCeRodriguez) - [LinkedIn](https://www.linkedin.com/in/rodriguezjavierc/)
""")
col2.image("https://avatars.githubusercontent.com/u/68615684?v=4")

col3.subheader("Gabriel Arnesano")
col3.write("""
[GitHub](https://github.com/gabrielArne) - [LinkedIn](https://www.linkedin.com/in/gabriel-arnesano/)
""")
col3.image("https://avatars.githubusercontent.com/u/115743146?v=4")

