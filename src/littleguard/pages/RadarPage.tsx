import AppBar from '../../common/ui/AppBar';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';

/** Task 4 會把板長出來；這一步只讓路由與骨架編得過並可實際打開。 */
export default function RadarPage() {
  const theme = SERVICE_THEME.littleguard;
  return (
    <div className={`screen ${theme.pageBg}`}>
      <AppBar theme={theme} title={theme.name} subtitle={theme.role} />
      <div className="screen-body" />
    </div>
  );
}
