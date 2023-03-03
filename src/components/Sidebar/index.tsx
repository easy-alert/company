// LIBS
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// STYLES
import * as Style from './styles';
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
    { icon: icon.calendar, url: '/calendar' },
    { icon: icon.maintenances, url: '/maintenances' },
    { icon: icon.building, url: '/buildings' },
    // { icon: icon.report, url: '/report/create' },
    { icon: icon.gear, url: '/account' },
    { icon: icon.power, url: '/login' },
  ];

  useEffect(() => {
    if (window.location.href.endsWith('/')) {
      navigate('/calendar');
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
              opacity="0.5"
              icon={element.icon}
              onClick={() => {
                const checkKeyPress = window.event as KeyboardEvent;
                if (checkKeyPress?.ctrlKey) {
                  window.open(element.url, '_blank');
                } else if (openSidebar) {
                  setAnimate(false);
                  setTimeout(() => {
                    setOpenSidebar(false);
                    navigate(element.url);
                  }, 125);
                } else {
                  navigate(element.url);
                }
              }}
              onAuxClick={() => {
                if (openSidebar) {
                  setAnimate(false);
                  setTimeout(() => {
                    setOpenSidebar(false);
                    window.open(element.url, '_blank');
                  }, 125);
                } else {
                  window.open(element.url, '_blank');
                }
              }}
              selected={window.location.pathname.startsWith(element.url)}
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
