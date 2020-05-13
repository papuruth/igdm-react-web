import styled from 'styled-components';

import colors from '@/styles/colors';

export const StyledContainer = styled.div`
  align-items: center;
  background-color: ${colors.background};
  border-radius: 3px;
  color: ${colors.light};
  display: flex;
  flex-direction: column;
  padding: 50px 0;
  width: 100%;
`;
