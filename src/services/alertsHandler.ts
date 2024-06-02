import {HiveDataPayload} from 'src/controllers/hiveData.controller.js';
import wss from './webSocketServer.js';

type Alert = {
  type: 'weight' | 'tilt' | 'temperature' | 'sensor';
  message: string;
  severity: 'low' | 'medium' | 'high' | '-';
};

function sendAlert(alert: Alert[]) {
  console.log('Sending alert:', alert);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(JSON.stringify(alert));
  });
}

function getWeightAlert(data: HiveDataPayload): Alert | null {
  const weight = data.weight ?? 0;

  if (weight > 40000) return {type: 'weight', message: 'Weight is greater than 40kg', severity: 'high'};
  if (weight > 30000) return {type: 'weight', message: 'Weight is greater than 30kg', severity: 'medium'};
  if (weight > 20000) return {type: 'weight', message: 'Weight is greater than 20kg', severity: 'low'};
  return null;
}

function getTiltAlert(data: HiveDataPayload): Alert | null {
  const isTilted = Math.abs(data.magnetic_x ?? 0) > 1000 || Math.abs(data.magnetic_y ?? 0) > 1000 || Math.abs(data.magnetic_z ?? 0) > 1000;
  if (isTilted) return {type: 'tilt', message: 'Hive is tilted', severity: '-'};
  return null;
}

function getTemperatureAlert(data: HiveDataPayload): Alert | null {
  const tempBottomLeft = data.tempBottomLeft ?? 0;
  const tempTopRight = data.tempTopRight ?? 0;
  const tempOutside = data.tempOutside ?? 0;

  // Vérification des températures du couvain (33°C - 36°C)
  if (tempBottomLeft < 33 || tempBottomLeft > 36 || tempTopRight < 33 || tempTopRight > 36) {
    return {
      type: 'temperature',
      message: 'Couvain temperature is outside 33°C - 36°C range',
      severity: 'high',
    };
  }
  // Vérification des températures extérieures
  if (tempOutside > 30) {
    return {
      type: 'temperature',
      message: 'Outside temperature is greater than 30°C, indicating queen laying extension',
      severity: 'medium',
    };
  }
  if (tempOutside < 14) {
    return {
      type: 'temperature',
      message: 'Outside temperature has dropped below 14°C',
      severity: 'high',
    };
  }
  // Vérification des températures critiques en hiver
  if (tempBottomLeft < 18 || tempTopRight < 18) {
    return {
      type: 'temperature',
      message: 'Internal temperature is below 18°C, indicating a serious issue',
      severity: 'high',
    };
  }
  return null;
}

export function checkAlerts(data: HiveDataPayload, user: any) {
  const alerts: Alert[] = [];

  //Verification si la ruche appartient à l'utilisateur
  if (!user) return;
  const userHive = user.hive.find((hive: any) => hive.id === data.hiveId);
  if (!userHive) return;

  // Vérification du fonctionnement des capteurs
  for (const key in data) {
    if (key !== 'hiveId' && key !== 'id') {
      const sensorData = data[key as keyof HiveDataPayload];
      if (sensorData === undefined || sensorData === null || (typeof sensorData === 'number' && isNaN(sensorData))) {
        alerts.push({
          type: 'sensor',
          message: `Sensor '${key}' is not sending valid data`,
          severity: 'high',
        });
      }
    }
  }

  const weightAlert = getWeightAlert(data);
  if (weightAlert) alerts.push(weightAlert);

  const tiltAlert = getTiltAlert(data);
  if (tiltAlert) alerts.push(tiltAlert);

  const temperatureAlert = getTemperatureAlert(data);
  if (temperatureAlert) alerts.push(temperatureAlert);

  if (alerts.length > 0) sendAlert(alerts);
}
