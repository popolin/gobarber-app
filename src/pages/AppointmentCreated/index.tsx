import { useNavigation, useRoute } from '@react-navigation/native';
import { format, isToday } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  Title,
  DateContainer,
  DayDescription,
  Day,
  HourDescription,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();
  const { date } = params as RouteParams;

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);

  const formattedDayDescription = useMemo(() => {
    const newDate = new Date(date);
    if (isToday(newDate)) {
      return 'Hoje';
    }
    let weekday = format(date, 'EEEE', {
      locale: ptBr,
    });
    weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    if (newDate.getDay() !== 0 && newDate.getDay() !== 6) {
      weekday = `${weekday}-feira`;
    }
    return weekday;
  }, [date]);

  const formattedDay = useMemo(() => {
    return format(date, "dd 'de' MMMM 'de' yyyy", {
      locale: ptBr,
    });
  }, [date]);

  const formattedHour = useMemo(() => {
    return format(date, "HH:mm'h'");
  }, [date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento Concluído</Title>
      <DateContainer>
        <DayDescription>{formattedDayDescription}</DayDescription>
        <Day>{formattedDay}</Day>
        <HourDescription>{formattedHour}</HourDescription>
      </DateContainer>
      <OkButton
        onPress={() => {
          handleOkPressed();
        }}
      >
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
