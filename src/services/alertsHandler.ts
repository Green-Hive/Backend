import {HiveDataPayload} from 'src/controllers/hiveData.controller.js';
import pusher from './webSocketServer.js';
import {AlertSeverity, AlertType} from '@prisma/client';
import prisma from './prisma.js';

type Alert = {
  type: AlertType;
  message: string;
  severity: AlertSeverity;
};

function sendAlert(alert: Alert[]) {
  console.log('Sending alert:', alert);
  pusher.trigger('my-channel', 'my-event', alert);
}

async function createOrUpdateAlert(hiveId: string, alert: Alert) {
  const existingAlert = await prisma.alert.findFirst({
    where: {
      hiveId,
      type: alert.type,
      message: alert.message,
      severity: alert.severity,
    },
  });

  if (!existingAlert) {
    await prisma.alert.create({
      data: {
        hiveId,
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
      },
    });
  }
}

function getWeightAlert(data: HiveDataPayload): Alert | null {
  const weight = data.weight ?? 0;

  if (weight > 40000)
    return {
      type: AlertType.WEIGHT,
      message: 'Weight is greater than 40kg',
      severity: AlertSeverity.CRITICAL,
    };
  if (weight > 30000)
    return {
      type: AlertType.WEIGHT,
      message: 'Weight is greater than 30kg',
      severity: AlertSeverity.WARNING,
    };
  if (weight > 20000)
    return {
      type: AlertType.WEIGHT,
      message: 'Weight is greater than 20kg',
      severity: AlertSeverity.INFO,
    };
  return null;
}

function getTiltAlert(data: HiveDataPayload): Alert | null {
  const isTilted = Math.abs(data.magnetic_x ?? 0) > 1000 || Math.abs(data.magnetic_y ?? 0) > 1000 || Math.abs(data.magnetic_z ?? 0) > 1000;
  if (isTilted) return {type: AlertType.TILT, message: 'Hive is tilted', severity: AlertSeverity.WARNING};
  return null;
}

function getTemperatureAlert(data: HiveDataPayload): Alert | null {
  const tempBottomLeft = data.tempBottomLeft ?? 0;
  const tempTopRight = data.tempTopRight ?? 0;
  const tempOutside = data.tempOutside ?? 0;

  // Vérification des températures du couvain (33°C - 36°C)
  if (tempBottomLeft < 33 || tempBottomLeft > 36 || tempTopRight < 33 || tempTopRight > 36) {
    return {
      type: AlertType.TEMP,
      message: 'Couvain temperature is outside 33°C - 36°C range',
      severity: AlertSeverity.WARNING,
    };
  }
  // Vérification des températures extérieures
  if (tempOutside > 30) {
    return {
      type: AlertType.TEMP,
      message: 'Outside temperature is greater than 30°C, indicating queen laying extension',
      severity: AlertSeverity.WARNING,
    };
  }
  if (tempOutside < 14) {
    return {
      type: AlertType.TEMP,
      message: 'Outside temperature has dropped below 14°C',
      severity: AlertSeverity.CRITICAL,
    };
  }
  // Vérification des températures critiques en hiver
  if (tempBottomLeft < 18 || tempTopRight < 18) {
    return {
      type: AlertType.TEMP,
      message: 'Internal temperature is below 18°C, indicating a serious issue',
      severity: AlertSeverity.CRITICAL,
    };
  }
  return null;
}

export async function checkAlerts(data: HiveDataPayload, user: any) {
  const alerts: Alert[] = [];

  // Vérification du fonctionnement des capteurs
  for (const key in data) {
    if (key !== 'hiveId' && key !== 'id') {
      const sensorData = data[key as keyof HiveDataPayload];
      if (sensorData === undefined || sensorData === null || (typeof sensorData === 'number' && isNaN(sensorData))) {
        alerts.push({
          type: AlertType.SENSOR,
          message: `Sensor '${key}' is not sending valid data`,
          severity: AlertSeverity.INFO,
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

  // Crée ou met à jour les alertes si elles n'existent pas ou si elles changent
  for (const alert of alerts) {
    await createOrUpdateAlert(data.hiveId, alert);
  }

  //Verification si la ruche appartient à l'utilisateur
  if (!user) return;
  const userHive = user.hive.find((hive: any) => hive.id === data.hiveId);
  if (!userHive) return;

  if (alerts.length > 0) sendAlert(alerts);
}
