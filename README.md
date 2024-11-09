# Cartographie des lignes iso potentielles dans une cuve rhéostatique
## Résumé
La cartographie des lignes isopotentielles dans une cuve rhéostatique est réalisée à l'aide d'une platine Arduino servant de voltmètre et d'une webcam qui suit et enregistre la position de la sonde en temps réelle pour tracer sur l'image de la cuve la série de lignes isopotentielles. 
## Mode d'emploi
### Installation du script Arduino 
Télécharger puis installer le script [voltmetre.ino](https://github.com/physicus68/carto_potentiels/blob/main/arduino/voltmetre/voltmetre.ino) sur une Arduino Uno R3.
### Installation du montage
Une webcam est fixéée à la verticale de la cuve rhéostatique de façon à filmer en plein écran la cuve. L'image sera tournée de 180° par l'application afin de paraître à l'endroit à l'écran.

L'Arduino Uno R3 est placée sur son bornier, la cuve est alimentée sous 5 volts et la sonde est reliée à l'endrée A0 de l'Arduino via le bornier.
### Utilisation de l'application
On se connecte avec Google Chrome ou Opera sur l'application https://physicus68.github.io/carto_potentiels. Attention, le navigateur Firefox ne fonctionne pas avec cette application (novembre 2024 - l'API webserial n'est pas encore implémentée dans Firefox).

On doit d'abord calibrer la caméra pour suivre le repère orange fluo sur la sonde. On passe en mode calibration puis on clique sur le conféti orange visiblme sur l'écran, un spot jaune poursuit l'image du confeti. Esuite on désactive le mode calibration en cliquant sur le bouton.

L'étape suivante consiste à se connecter sur Arduino Uno qui mesure alors la tension à l'aide de la sonde.

La dernière étape consiste à activerle mode cartographie des lignes isopotentielles, elles s'affichent sur l'écran au fur et à mesure que l'on explore la cuve rhéographique.

## Fabrication du montage
### Le bornier pour Arduino
- planchette 160mm x 100 mm environ
- trois équerres d'assemblage de 30mm pour fixer les bornes
- quatre morceaux de tige en bois de 3mm qui passent dans les trous de fixation de l'Arduino
- 
### La sonde de mesure
C'est un simple morceau de fil de fer sur lequel a été soudé une attache parisienne, et sur la tête de laquelle on a collé un confetti  orange fluo. Celui ci a été poinconné avec une perforatrice dans une flêche en carton (fourniture de magasin) puis collé à la colle cyanolite sur le métal.
Une borne a été vissée sur une boucle à l'extrémité de la sonde.

