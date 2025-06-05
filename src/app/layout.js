import "./globals.css";
import { MenuProvider } from '@/providers/MenuContext';
import { DeviceProvider } from "@/providers/DeviceProvider";
import I18nProvider from '@/providers/I18nProvider';
import { ReduxProvider } from '@/store/ReduxProvider';
import InitMSW from '@/mocks/InitMSW';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <MenuProvider>
            <I18nProvider>
              <DeviceProvider>
                <InitMSW />
                {children}
              </DeviceProvider>
            </I18nProvider>
          </MenuProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
