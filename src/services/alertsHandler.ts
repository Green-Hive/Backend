import {HiveDataPayload} from 'src/controllers/hiveData.controller.js';

// let lastData: { [key: string]: HiveDataPayload } = {};
// let lastUpdateTime: { [key: string]: number } = {};

export function checkAlerts(data: HiveDataPayload) {
  const alerts: string[] = [];

  if ((data.weight ?? 0) > 40000) alerts.push('Weight is greater than 40kg');


  // // Check if the hive is tilted
  // const isTilted = Math.abs(data.magnetic_x ?? 0) > 1000 || Math.abs(data.magnetic_y ?? 0) > 1000 || Math.abs(data.magnetic_z ?? 0) > 1000;
  // if (isTilted) {
  //   alerts.push('Hive is tilted');
  // }
  //
  // // Check for NaN or null values
  // const currentTime = data.time;
  // lastUpdateTime[data.time] = currentTime;
  //
  // for (const key in data) {
  //   if (data[key as keyof HiveDataPayload] === undefined || isNaN(data[key as keyof HiveDataPayload] as number)) {
  //     const lastTime = lastUpdateTime[hiveData.time];
  //     if (currentTime - lastTime > 60000) {
  //       // 1 minute
  //       alerts.push(`${key} sensor doesn't send any value for more than a minute`);
  //     }
  //   }
  // }

  // Check if weight is greater than 40kg


  // // Check for sudden temperature rise
  // const lastHiveData = lastData[hiveData.hiveId];
  // if (lastHiveData) {
  //   const tempRise =
  //     Math.abs((data.tempBottomLeft ?? 0) - (lastHiveData.tempBottomLeft ?? 0)) > 10 ||
  //     Math.abs((data.tempTopRight ?? 0) - (lastHiveData.tempTopRight ?? 0)) > 10 ||
  //     Math.abs((data.tempOutside ?? 0) - (lastHiveData.tempOutside ?? 0)) > 10;
  //   if (tempRise) {
  //     alerts.push('Sudden temperature rise');
  //   }
  // }

  // // Update the last data
  // lastData[hiveData.hiveId] = hiveData;

  console.log('Alerts:', alerts);
  // return alerts;
};

// app.post('/data', (req: Request, res: Response) => {
//   const hiveData: HiveData = req.body;

//   // Check for alerts
//   const alerts = checkAlerts(hiveData);

//   if (alerts.length > 0) {
//     // Send alerts to frontend (assuming there's a mechanism like WebSocket or another endpoint to notify the frontend)
//     console.log(`Alerts for hive ${hiveData.hive_id}:`, alerts);
//   }

//   res.status(200).send('Data received');
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });