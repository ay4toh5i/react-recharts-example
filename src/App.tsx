import styled from 'styled-components';
import { getUnixTime } from 'date-fns';
import { Graph } from './components/Graph';

const records = [
  {
    date: getUnixTime(new Date(2021, 10, 1)),
    weight: 3,
    height: 45,
  },
  {
    date: getUnixTime(new Date(2021, 12, 1)),
    weight: 4,
    height: 55,
  },
  {
    date: getUnixTime(new Date(2022, 2, 1)),
    weight: 6,
    height: 65,
  },
  {
    date: getUnixTime(new Date(2022, 6, 1)),
    weight: 7,
    height: 73,
  },
  {
    date: getUnixTime(new Date(2022, 12, 1)),
    weight: 9,
    height: 79,
  },
];

const Container = styled.div`
  width: 750px;
  margin-block: 5rem;
  margin-inline: auto;
`;

export const App = () => {
  return (
    <Container>
      <Graph 
        birthDate={new Date(2021, 10, 1)}  
        records={records} 
        intervalMonths={1} 
        monthsRange={[0, 24]}
        heightRange={[40, 120]}
        weightRange={[0, 15]}
      />
    </Container>
  );
};
