import * as Style from './styles';

export const WelcomeTutorial = () => (
  // const [viewedTutorial, setViewedTutorial] = useState<boolean>(true);

  // useEffect(() => {
  //   if (localStorage.getItem('viewedTutorial') === 'false') {
  //     setViewedTutorial(false);
  //   }
  // }, []);

  <Style.Container>
    <iframe
      title="welcome"
      src="https://www.youtube.com/embed/ZmAId85nywI"
      width="100%"
      height={540}
    />

    {/* {!viewedTutorial && (
        <Button
          onClick={() => {
            toast.success(
              'Você não será redirecionado novamente para o tutorial ao efetuar login!',
            );
            setViewedTutorial(true);
            localStorage.setItem('viewedTutorial', 'true');
          }}
          label="Não ver este tutorial novamente"
        />
      )} */}
  </Style.Container>
);
