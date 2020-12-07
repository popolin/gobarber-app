import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CalendarStrip from 'react-native-calendar-strip';

import { format, isAfter, isSameDay } from 'date-fns';
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
  Content,
  ProviderListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentText,
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
  const { goBack, navigate } = useNavigation();

  const routeParams = route.params as RouteParams;

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>(
    routeParams.providerId,
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId) => {
    setSelectedProvider(providerId);
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(new Date(date));
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
    [selectedMonth],
  );

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post(`appointments`, {
        providerId: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar um agendamento. Tente novamente.',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const datesBlacklistFunc = useCallback(
    (date) => {
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

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const customDatesStylesFunc = useCallback(() => {
    return {
      dateNameStyle: { color: '#f4ede8' },
      dateNumberStyle: { color: '#f4ede8' },
      dateContainerStyle: { backgroundColor: '#3e3b47' },
    };
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Agendar Serviço</HeaderTitle>
        <UserAvatar source={{ uri: user.avatarUrl }} />
      </Header>
      <Content>
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
          <Title>Escolha a data:</Title>
          <CalendarStrip
            scrollable
            calendarAnimation={{ type: 'sequence', duration: 30 }}
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
            style={{
              height: 100,
              paddingTop: 5,
            }}
            calendarHeaderStyle={{
              color: '#f4ede8',
              fontFamily: 'RobotoSlab-Regular',
            }}
            highlightDateNumberStyle={{ color: '#232129' }}
            highlightDateNameStyle={{
              color: '#232129',
              fontWeight: 'bold',
            }}
            customDatesStyles={() => customDatesStylesFunc()}
            disabledDateNameStyle={{ color: '#fefefe' }}
            disabledDateNumberStyle={{ color: '#fefefe' }}
            selectedDate={new Date()}
            onDateSelected={(date) => handleSelectDate(date)}
            onWeekChanged={(start, end) => handleChangeCalendarWeek(start, end)}
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
                weekdaysShort: [
                  'Dom',
                  'Seg',
                  'Ter',
                  'Qua',
                  'Qui',
                  'Sex',
                  'Sáb',
                ],
              },
            }}
            // iconContainer={{ flex: 0.1 }}
          />
        </Calendar>

        <Schedule>
          <Title>Escolha o horário:</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ hour, formattedHour, available }) => (
                <Hour
                  onPress={() => handleSelectHour(hour)}
                  available={available}
                  key={formattedHour}
                  selected={selectedHour === hour}
                >
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ hour, formattedHour, available }) => (
                  <Hour
                    onPress={() => handleSelectHour(hour)}
                    available={available}
                    key={formattedHour}
                    selected={selectedHour === hour}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentButton
          onPress={() => {
            handleCreateAppointment();
          }}
        >
          <CreateAppointmentText>Agendar</CreateAppointmentText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
