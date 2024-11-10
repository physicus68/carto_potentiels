// position de la video
let x0 = 245;
let y0 = 105;

// paramètres caméra
let webcam;
let webcam_w = 640;
let webcam_h = 480;
let appli_initalisee = false;
let calque_camera;

// gestion du pointeur et de son suivi
let coul_track_pointeur = [255, 255, 255];
let sensibilite = 5000;
let mode_calibration = false;
let x_pointeur = webcam_w / 2;
let y_pointeur = webcam_h / 2;
let calque_pointeur;
let bouton_mode_calib_pointeur;

// gestion de Arduino Uno R3
let arduino;
let bouton_connexion_arduino;
let arduino_connectee = false;
let tension = 0.0;

// cartographie des lignes isopotentielles
let calque_lignes_isopotentielles;
let bouton_cartographier_lignes;
let cartographier_les_lignes = false;
let label_tension;
let pas = 0.5; // pas de tension entre les lignes de potentiel
let fenetre = 0.025; // tolérence pour la mesure de la ligne de potentiel

function initalisationWebcam(p5) {
  let constraints = {
    video: {
      width: webcam_w,
      height: webcam_h,
    },
    audio: false,
  };
  calque_camera = p5.createGraphics(webcam_w, webcam_h);
  calque_camera.background(0);
  webcam = p5.createCapture(VIDEO, constraints, cameraPrete);
  webcam.hide();
}

function cameraPrete() {
  appli_initalisee = true;
}

function initialisationPointeur() {
  calque_pointeur = createGraphics(webcam_w, webcam_h);
}

function initalisationCarteLignes() {
  calque_lignes_isopotentielles = createGraphics(webcam_w, webcam_h);
}

function afficherCamera() {
  // on tourne l'image de 180°
  calque_camera.push();
  calque_camera.translate(webcam_w / 2, webcam_h / 2);
  calque_camera.rotate(PI);
  calque_camera.imageMode(CENTER);
  calque_camera.image(webcam, 0, 0);
  image(calque_camera, x0, y0);
  calque_camera.pop();
}

function afficherPointeur() {
  // on cherche la position du spot orange dans l'image
  if (calque_camera !== null) {
    calque_camera.loadPixels();
    let buf_x = 0;
    let buf_y = 0;
    let i,
      delta_r,
      delta_v,
      delta_b,
      distance = 0;
    let n = 0;
    for (let y = 0; y < webcam_h; y++) {
      for (let x = 0; x < webcam_w; x++) {
        i = 4 * (x + webcam_w * y);
        delta_r = calque_camera.pixels[i] - coul_track_pointeur[0];
        delta_v = calque_camera.pixels[i + 1] - coul_track_pointeur[1];
        delta_b = calque_camera.pixels[i + 2] - coul_track_pointeur[2];
        distance = delta_r ** 2 + delta_v ** 2 + delta_b ** 2;
        if (distance < sensibilite) {
          n = n + 1;
          buf_x = buf_x + x;
          buf_y = buf_y + y;
        }
      }
    }
    x_pointeur = buf_x / n;
    y_pointeur = int(buf_y / n);

    // on affiche le pointeur sur le calque
    calque_pointeur.clear();
    calque_pointeur.fill("yellow");
    calque_pointeur.noStroke();
    calque_pointeur.circle(x_pointeur, y_pointeur, 7);
  }

  image(calque_pointeur, x0, y0);
}

function mouseClicked() {
  if (mode_calibration) {
    coul_track_pointeur = get(mouseX, mouseY);
  }
}

function set_mode_colibration_mire() {
  mode_calibration = !mode_calibration;
  if (mode_calibration) {
    bouton_mode_calib_pointeur.class("mode_actif");
  } else {
    bouton_mode_calib_pointeur.removeClass("mode_actif");
  }
}

function connexionArduino() {
  if (!arduino_connectee) {
    arduino = createSerial();
    if (!arduino.opened()) {
      arduino.open("Arduino", 9600);
    } else {
      arduino_connectee = false;
      arduino.close();
    }
    arduino_connectee = true;
  } else {
    arduino.close();
    arduino_connectee = false;
  }

  if (arduino_connectee) {
    bouton_connexion_arduino.class("mode_actif");
  } else {
    bouton_connexion_arduino.removeClass("mode_actif");
  }
}

function cartographieLignesIsopotentiels() {
  cartographier_les_lignes = !cartographier_les_lignes;
  if (cartographier_les_lignes) {
    calque_lignes_isopotentielles.clear();
    bouton_cartographier_lignes.class("mode_actif");
  } else {
    bouton_cartographier_lignes.removeClass("mode_actif");
  }
}

function afficherCarteLignes() {
  if (cartographier_les_lignes) {
    if (arduino_connectee) {
      // on lit la tension mesurée par la sonde dans la cuve
      arduino.write("m");
      tension = arduino.readUntil("\n");

      // on trace un point proche d'une ligne isopotentielle      
      let h = (tension / 5.0) * 255;
      let c = color(0, 0, h);      
      if (Math.abs(tension - int(tension / pas) * pas) < fenetre) {
        calque_lignes_isopotentielles.noStroke();
        calque_lignes_isopotentielles.fill(c);
        calque_lignes_isopotentielles.circle(x_pointeur, y_pointeur, 5);
      }
      image(calque_lignes_isopotentielles, x0, y0);
      label_tension.html("Tension: " + tension + " V");
    }
  }
}

/******************************************************************************
 *  initialisation au démarrage
 *****************************************************************************/
function setup() {
  let canvas_application = createCanvas(900, 600);
  canvas_application.parent("application");

  let titre_calib = createP("1. Calibrer le pointeur.");
  titre_calib.position(25, 100);
  titre_calib.parent("application");

  let titre = createElement("h1", "Cartographie des lignes isopotentielles");
  titre.parent("application");
  titre.position(0, 30);

  bouton_mode_calib_pointeur = createButton("Calibration du pointeur");
  bouton_mode_calib_pointeur.position(25, 150);
  bouton_mode_calib_pointeur.mousePressed(set_mode_colibration_mire);
  bouton_mode_calib_pointeur.parent("application");

  let titre_connexion = createP("2. Connecter Arduino.");
  titre_connexion.position(25, 200);
  titre_connexion.parent("application");

  bouton_connexion_arduino = createButton("Connexion Arduino");
  bouton_connexion_arduino.position(25, 250);
  bouton_connexion_arduino.mousePressed(connexionArduino);
  bouton_connexion_arduino.parent("application");

  let titre_courbes = createP(
    "3. Tracer les courbes <br>isopotentielles tous <br>les 0.5 volts."
  );
  titre_courbes.position(25, 300);
  titre_courbes.parent("application");

  bouton_cartographier_lignes = createButton("Lignes isopotentielles");
  bouton_cartographier_lignes.position(25, 390);
  bouton_cartographier_lignes.mousePressed(cartographieLignesIsopotentiels);
  bouton_cartographier_lignes.parent("application");

  label_tension = createP("Tension: ");
  label_tension.position(25, 420);
  label_tension.parent("application");
  label_tension.class("label_tension");

  initalisationWebcam(this);
  initialisationPointeur();
  initalisationCarteLignes();
}

/******************************************************************************
 *  boucle principale
 *****************************************************************************/
function draw() {
  if (appli_initalisee) {
    afficherCamera();
    afficherCarteLignes();
    afficherPointeur();
  }
}
