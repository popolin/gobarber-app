import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import CalendarStrip from 'react-native-calendar-strip';

import { isAfter, isSameDay } from 'date-fns';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import leftIcon from '../../assets/img/left-arrow.png';
import rightIcon from '../../assets/img/right-arrow.png';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProviderListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
} from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
  password: string;
}

interface MonthAvailabilityItem {
  day: string;
  available: boolean;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { goBack } = useNavigation();

  const routeParams = route.params as RouteParams;

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>(
    routeParams.providerId,
  );
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId) => {
    setSelectedProvider(providerId);
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleChangeCalendarWeek = useCallback(
    (startDate: Date, endDate: Date) => {
      const endDateParsed = new Date(endDate);
      const endDateTratted = new Date(
        endDateParsed.getFullYear(),
        endDateParsed.getMonth(),
        endDateParsed.getDate() + 15,
      );
      if (isAfter(endDateTratted, selectedMonth)) {
        setSelectedMonth(new Date(startDate));
      }
    },
    [],
  );

  const datesBlacklistFunc = useCallback(
    (date) => {
      // return date.isoWeekday() === 7; // Desabilitar domingos

      const dayAvailability = monthAvailability.find((ma) => {
        const dateParsed = new Date(ma.day);
        return isSameDay(dateParsed, new Date(date));
      });

      return !dayAvailability?.available;
    },
    [monthAvailability],
  );

  useEffect(() => {
    api.get('providers').then((response) => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    // api
    //   .get(`/providers${selectedProvider}/day-availability`, {
    //     params: {
    //       year: selectedDate.getFullYear(),
    //       month: selectedDate.getMonth() + 1,
    //       day: selectedDate.getDate(),
    //     },
    //   })
    //   .then((response) => {
    //     setAvailability(response.data);
    //   });
  }, [selectedDate, selectedProvider]);

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/week-availability`, {
        params: {
          year: selectedMonth.getFullYear(),
          month: selectedMonth.getMonth() + 1,
          day: selectedMonth.getDate(),
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [selectedMonth, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Agendar Serviço</HeaderTitle>
        <UserAvatar source={{ uri: user.avatarUrl }} />
      </Header>
      <ProviderListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider) => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => handleSelectProvider(provider.id)}
              selected={selectedProvider === provider.id}
            >
              <ProviderAvatar source={{ uri: provider.avatarUrl }} />
              <ProviderName selected={selectedProvider === provider.id}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProviderListContainer>
      <Calendar>
        <Title>Data do serviço:</Title>
        <CalendarStrip
          scrollable
          // calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{
            type: 'background',
            duration: 10,
            highlightColor: '#ff9000',
            animType: null,
            animUpdateType: null,
            animProperty: null,
            animSpringDamping: null,
          }}
          minDate={new Date()}
          iconLeft={leftIcon}
          iconRight={rightIcon}
          style={{ height: 100, paddingBottom: 5 }}
          selectedDate={selectedDate}
          calendarHeaderContainerStyle={{
            height: 0,
          }}
          calendarHeaderStyle={{
            color: '#f4ede8',
          }}
          // calendarColor="#F8d8d8d"
          dateNumberStyle={{ color: '#f4ede8' }}
          dateNameStyle={{ color: '#f4ede8' }}
          highlightDateNumberStyle={{ color: '#232129' }}
          highlightDateNameStyle={{
            color: '#232129',
            fontWeight: 'bold',
          }}
          disabledDateNameStyle={{ color: '#fefefe' }}
          disabledDateNumberStyle={{ color: '#fefefe' }}
          onDateSelected={handleSelectDate}
          onWeekChanged={(start, end) => handleChangeCalendarWeek(start, end)}
          // markedDates={data.formattedDaysOfMonth}
          datesBlacklist={(date) => datesBlacklistFunc(date)}
          locale={{
            name: 'ptBR',
            config: {
              months: [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
              ],
              weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            },
          }}
          // iconContainer={{ flex: 0.1 }}
        />
      </Calendar>
    </Container>
  );
};

export default CreateAppointment;
