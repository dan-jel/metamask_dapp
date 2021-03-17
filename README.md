# Metamask dapp

<br />

Das ist mein erster Versuch eine Metamask Dapp zu erstellen.
In der ersten Phase probiere ich die grundlegenden Interaktionen mit einem Wallet zu ermöglichen, wie z.B. das Anzeigen der Coins / Tokens auf der jeweiligen Adresse sowie Überweisungen direkt von der Website zu initialisieren und dann via der Metamask Extension zu bestätigen.

<br />

---

## Docker // Installation

Nach dem Clonen des Git-Repositorys und der Installation der benötigten `node_modules` via

```bash
npm install
```

kann man den Docker Container mit den folgenden zwei Befehlen zum laufen bringen:

<br />

1. Mit Hilfe des Dockerfiles ein Docker-Image bauen:

```bash
docker build -f Dockerfile.prod -t dapp .
```

2.  Das Docker-Image ausführen und auf Port `92` des `localhosts` exposen:

```bash
docker run -d -p 92:80 --rm dapp
```

<br />

---

## Ganache-CLI

Um die Website in einer sicheren Umgebung zu entwickeln und testen benutze ich `ganache-cli`.
Diese kann man mit einem kurzen Befehl selber installieren und direkt ausführen.

```console
npm i -g ganache-cli && ganache-cli
```

Mit den folgenden Parametern kann man die `ganache-cli` noch konfigurieren:
<br/>

1.  `-h` | um den Host zu spezfizieren

2.  `-p` | um den Port zu spezifizieren

> Standardmäßig läuft `ganache-cli` auf `127.0.0.1:8545 `

3. `-a` | um die Anzahl der erstellen Testaccounts zu bestimmen

4. `-e` | um die Anzahl der Ether einzustellen, mit denen die Testaccounts initialisiert werden

5. `-m` | um die Testaccounts anhand des `Seedphrase` zu initialisieren, um diese direkt in der Metamaskextension sehen und verwalten zu können.
