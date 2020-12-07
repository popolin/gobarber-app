import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  font-size: 32px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin-top: 16px;
  text-align: center;
`;

export const DateContainer = styled.View`
  align-items: center;
  border-color: #999591;
  margin-top: 32px;
  border-width: 1px;
  border-radius: 10px;
  padding: 8px 32px;
`;

export const DayDescription = styled.Text`
  font-family: 'RobotoSlab-Regular';
  font-size: 20px;
  color: #f4ede8;
`;

export const Day = styled.Text`
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
  color: #999591;
  margin-top: 6px;
`;

export const HourDescription = styled.Text`
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
  color: #f4ede8;
  margin-top: 6px;
`;

export const OkButton = styled(RectButton)`
  background: #ff9000;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 24px;
  padding: 12px 64px;
`;

export const OkButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
  font-size: 18px;
`;
