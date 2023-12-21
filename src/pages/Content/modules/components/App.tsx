import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from './header';
import ContentLoader from './content-loader';
import getPeriod from '../utils/getPeriod';
import { useOptionsStore } from '../hooks/useOptions';
import { OptionsContext } from '../contexts/contexts';
import { Options } from '../types';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

interface AppProps {
  options: Options;
}

export default function App({ options }: AppProps): JSX.Element {
  const [delta, setDelta] = useState(0);
  const [clickableState, setClickableState] = useState({
    clickable: false,
    firstLoad: true,
  });
  const optionsStore = useOptionsStore(options);
  const { start, end } = useMemo(() => {
    return getPeriod(
      options.period,
      options.start_date,
      options.start_hour,
      options.start_minutes,
      delta,
      options.rolling_period
    );
  }, [options, delta]);

  /*
    when prev/next buttons clicked
  */
  function incrementDelta(d: number) {
    setDelta(delta + d);
  }
  /*
    only allow prev/next buttons to be clicked once content is loaded
  */
  function loadedCallback() {
    setClickableState({ clickable: true, firstLoad: false });
  }
  function onPrevClick() {
    setClickableState({ clickable: false, firstLoad: false });
    incrementDelta(-1);
  }
  function onNextClick() {
    setClickableState({ clickable: false, firstLoad: false });
    incrementDelta(1);
  }
  // options will always be available to children
  return (
    <AppContainer id="tfc-wall-sina">
      <OptionsContext.Provider value={optionsStore}>
        <Header
          clickable={clickableState.clickable}
          dark={options.dark_mode}
          onNextClick={onNextClick}
          onPrevClick={onPrevClick}
          weekEnd={end}
          weekStart={start}
        />
        <ContentLoader
          clickable={clickableState.clickable}
          endDate={end}
          firstLoad={clickableState.firstLoad}
          loadedCallback={loadedCallback}
          options={options}
          startDate={start}
        />
      </OptionsContext.Provider>
    </AppContainer>
  );
}
