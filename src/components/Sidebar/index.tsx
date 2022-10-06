// LIBS
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import { theme } from '../../styles/theme';
import * as Style from './styles';

// ICONS
import { icon } from '../../assets/icons/index';

// COMPONENTS
import { Image } from '../Image';
import { IconButton } from '../Buttons/IconButton';

// TYPES
import { ISidebar, SidebarContentProps } from './utils/types';

export const Sidebar = ({ children }: ISidebar) => {
  const navigate = useNavigate();

  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(true);

  const SidebarContent: SidebarContentProps[] = [
    { icon: icon.user, label: 'Usuários', url: '/companies' },
    { icon: icon.maintenances, label: 'Manutenções', url: '/maintenances' },
    { icon: icon.power, label: 'Sair', url: '/login' },
  ];

  useEffect(() => {
    if (window.location.href.endsWith('/')) {
      navigate('/companies');
    }
  }, []);

  return (
    <Style.Background>
      <Style.SidebarBodyMobile>
        <IconButton
          labelPos="bottom"
          icon={icon.list}
          onClick={() => {
            setAnimate(true);
            setOpenSidebar(true);
          }}
        />
        <Style.ImageMobile>
          <Image width="44px" height="48px" radius="0px" img={icon.logoWhite} />
        </Style.ImageMobile>
      </Style.SidebarBodyMobile>

      <Style.SidebarBody openSidebar={openSidebar}>
        <Style.CloseButtonMobile>
          <IconButton
            labelPos="bottom"
            icon={icon.xWhite}
            onClick={() => {
              setAnimate(false);
              setTimeout(() => {
                setOpenSidebar(false);
              }, 125);
            }}
          />
        </Style.CloseButtonMobile>

        <Style.ImageContainer>
          <Image width="44px" height="48px" radius="0px" img={icon.logoWhite} />
        </Style.ImageContainer>

        <Style.Hr />

        {SidebarContent.map((element, i: number) => (
          <React.Fragment key={element.url}>
            {i === SidebarContent.length - 1 && <Style.Spacer />}
            <IconButton
              fontWeight="400"
              className="p5"
              labelPos="bottom"
              opacity="0.5"
              label={element.label}
              icon={element.icon}
              color={theme.color.white}
              gap="0px"
              onClick={() => {
                navigate(element.url);
                if (openSidebar) {
                  setAnimate(false);
                  setTimeout(() => {
                    setOpenSidebar(false);
                  }, 125);
                }
              }}
              selected={window.location.pathname.startsWith(element.url) || element.url === '/login'}
            />
          </React.Fragment>
        ))}
      </Style.SidebarBody>

      {openSidebar && (
        <Style.MobileBackground
          animate={animate}
          onClick={() => {
            setAnimate(false);
            setTimeout(() => {
              setOpenSidebar(false);
            }, 125);
          }}
        />
      )}

      <Style.AppContent>{children}</Style.AppContent>
    </Style.Background>
  );
};
