from time import time, sleep
import subprocess
import sched


scheduler = sched.scheduler(time, sleep)
horas = 5 * 3600


def job():
    subprocess.run('ping contar-con-datos-2023-sarasa.streamlit.app')
    scheduler.enter(horas, 1, job)


scheduler.enter(0, 1, job)
scheduler.run()
