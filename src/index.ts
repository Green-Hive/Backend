import app from "./app";
import figlet from "figlet";

//Design just to show the url of the swagger documentation
import('terminal-link').then((terminalLink) => {
  const styledText = '\x1b[1m\x1b[32m' + 'Server running at: ' + '\x1b[0m';
  const PORT = process.env.PORT || 4000;
  const url = 'http://localhost:' + PORT + '/api/swagger';

  console.log(styledText);
  console.log('  \x1b[1m\x1b[32m➜\x1b[0m  Local:  ' + '\x1b[1m\x1b[34m' + url + '\x1b[0m');
  console.log('  \x1b[1m\x1b[32m➜\x1b[0m  Network:  ' + '');
  console.log('_________________________________________________________________\n');
});

figlet('Green Hive API', (error: any, data: any) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
});

app.listen(process.env.PORT || 4000);
