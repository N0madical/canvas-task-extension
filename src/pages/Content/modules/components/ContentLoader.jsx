import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TaskContainer from './TaskContainer';
import MoonLoader from 'react-spinners/MoonLoader';
import { css } from '@emotion/core';
import { dataFetcher } from '../api/APIcalls';

function compareProps(prevProps, nextProps) {
  return (
    prevProps.startDate.getDate() == nextProps.startDate.getDate() &&
    prevProps.endDate.getDate() == nextProps.endDate.getDate()
  );
}

function ContentLoader({ startDate, endDate, loadedCallback }) {
  const [data, setData] = useState({});
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        setPending(true);
        setError(false);
        const response = await dataFetcher.getRelevantAssignments(
          startDate,
          endDate
        );
        setData(response);
        loadedCallback();
        setPending(false);
      } catch (err) {
        setPending(false);
        loadedCallback();
        setError(true);
      }
    }
    fetchData();
  }, [startDate, endDate, setData, setPending, setError]);
  const failed = 'Failed to load';
  return (
    <>
      {isPending && !error && (
        <div
          style={{
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MoonLoader
            color="var(--ic-link-color)"
            css={css`
              align-self: center;
            `}
            loading
            size={50}
          />
        </div>
      )}
      {!isPending && !error && <TaskContainer data={data} />}
      {error && <h1>{failed}</h1>}
    </>
  );
}

ContentLoader.defaultProps = {
  loadedCallback: () => {},
};

ContentLoader.propTypes = {
  endDate: PropTypes.instanceOf(Date).isRequired,
  loadedCallback: PropTypes.func,
  startDate: PropTypes.instanceOf(Date).isRequired,
};

export default React.memo(ContentLoader, compareProps);
