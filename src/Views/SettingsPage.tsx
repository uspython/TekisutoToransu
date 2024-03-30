import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuickCamera} from 'hook';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SectionList,
  SafeAreaView,
  useColorScheme,
  Linking,
} from 'react-native';
import {I18n, SystemColor} from 'res';
import {Routes} from './Routes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialIcons';

const ListHeader = () => {
  const colorSchema = useColorScheme();
  return (
    <View style={styles[colorSchema].header}>
      <Text style={styles[colorSchema].headerTitle}>
        {I18n.t('quick_start_camera')}
      </Text>
    </View>
  );
};

const Item = ({item, isFirst, isLast}) => {
  const colorSchema = 'light'; //useColorScheme();
  // Determine the item style based on its position or if it's the only item in the section
  const itemStyle = [
    styles[colorSchema].itemContainer,
    isFirst && isLast ? styles[colorSchema].singleItemContainer : null, // Apply full border radius if only one item
    isFirst && !isLast && styles[colorSchema].firstItemContainer, // Top border radius for the first item
    isLast && !isFirst && styles[colorSchema].lastItemContainer, // Bottom border radius for the last item
  ];

  switch (item.type) {
    case 'text':
      return (
        <View style={itemStyle}>
          <Text style={styles[colorSchema].itemTitle}>{item.title}</Text>
        </View>
      );
    case 'switch':
      return (
        <View style={itemStyle}>
          <Text style={styles[colorSchema].itemTitle}>{item.title}</Text>
          <Switch value={item.switchOn} onValueChange={item.onValueChange} />
        </View>
      );
    case 'textDetail':
      return (
        <TouchableOpacity style={itemStyle}>
          <Text style={styles[colorSchema].itemTitle}>{item.title}</Text>
          <Text style={styles[colorSchema].itemDetail}>{item.detail}</Text>
        </TouchableOpacity>
      );
    case 'textArrow':
      return (
        <TouchableOpacity style={itemStyle} onPress={item.onPress}>
          <Text style={styles[colorSchema].itemTitle}>{item.title}</Text>
          <Icons
            name="keyboard-arrow-right"
            size={20}
            color={SystemColor.tertiaryLabel.light}
          />
        </TouchableOpacity>
      );
    default:
      return <View />;
  }
};

type Props = NativeStackScreenProps<Routes, 'SettingsPage'>;

const SettingsScreen = (props: Props) => {
  const {navigation} = props;
  const colorSchema = useColorScheme();
  const [isQuickCamera, setQuickCamera] = useQuickCamera();

  const settingsData = [
    {
      title: I18n.t('general'),
      data: [
        {
          key: '1',
          title: I18n.t('quick_start_camera'),
          detail: 'Enabled',
          type: 'switch',
          switchOn: false,
          onValueChange: async (result: boolean) => {
            await setQuickCamera(result);
          },
        },
      ],
      footer: I18n.t('quick_start_camera_captain'),
    },
    // {
    //   title: null,
    //   data: [
    //     {
    //       key: '1',
    //       title: I18n.t('quick_start_camera'),
    //       type: 'text',
    //       detail: 'John Doe',
    //     },
    //     {key: '2', title: 'Airplane Mode', type: 'switch', switchOn: false},
    //     {key: '3', title: 'Wi-Fi', type: 'textDetail', detail: 'Not Connected'},
    //   ],
    //   footer: null,
    // },
    {
      title: 'Privacy',
      data: [
        {
          key: '7',
          title: 'Terms',
          type: 'textArrow',
          detail: 'Enabled',
          onPress: async () => {
            try {
              await Linking.openURL(
                'https://sites.google.com/view/jtexttrans/Term-of-Service',
              );
            } catch (error) {
              console.error('An error occurred', error);
            }
          },
        },
        {
          key: '8',
          title: 'Privacy',
          type: 'textArrow',
          detail: 'Enabled',
          onPress: async () => {
            try {
              await Linking.openURL(
                'https://sites.google.com/view/jtexttrans/Privacy-Policy',
              );
            } catch (error) {
              console.error('An error occurred', error);
            }
          },
        },
      ],
      footer: null,
    },
  ];

  const [sections, setSections] = useState(settingsData);

  useEffect(() => {
    const newSections = [...sections];
    newSections[0] = {
      ...newSections[0],
      data: [{...newSections[0].data[0], switchOn: isQuickCamera}],
    };

    // Update the state with the new array
    setSections(newSections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuickCamera]);

  return (
    <SafeAreaView style={styles[colorSchema].container}>
      <SectionList
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={item => item.key}
        // ListHeaderComponent={ListHeader}
        renderItem={({item, section, index}) => {
          const isFirst = index === 0;
          const isLast = index === section.data.length - 1;
          return <Item item={item} isFirst={isFirst} isLast={isLast} />;
        }}
        renderSectionHeader={({section: {title}}) => {
          if (title) {
            return (
              <Text style={styles[colorSchema].sectionHeader}>{title}</Text>
            );
          }
        }}
        renderSectionFooter={({section: {footer}}) => {
          if (footer) {
            return (
              <View style={styles[colorSchema].sectionFooter}>
                <Text style={styles[colorSchema].sectionFooterText}>
                  {footer}
                </Text>
              </View>
            );
          }
        }}
        contentContainerStyle={styles[colorSchema].listContentContainer}
        SectionSeparatorComponent={() => (
          <View style={styles[colorSchema].sectionSeparator} />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles[colorSchema].itemSeparator} />
        )}
      />
    </SafeAreaView>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SystemColor.secondarySystemBackground.light, // Matches the grouped list background color
    paddingTop: 20,
  },
  listContentContainer: {
    paddingHorizontal: 15, // Creates an inset effect for the entire list
  },
  header: {
    height: 150,
    backgroundColor: SystemColor.secondarySystemBackground.light, // Matches the grouped list background color
  },
  headerTitle: {
    color: SystemColor.secondaryLabel.light,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: SystemColor.secondarySystemBackground.light,
  },
  sectionFooter: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: SystemColor.secondarySystemBackground.light,
  },
  sectionFooterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: SystemColor.tertiaryLabel.light,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SystemColor.systemBackground.light,
    padding: 10,
    // Common style, no border radius here
  },
  firstItemContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastItemContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  singleItemContainer: {
    borderRadius: 10, // Full border radius for a single item
  },
  itemTitle: {
    fontSize: 16,
    color: SystemColor.label.light,
  },
  sectionSeparator: {
    height: 5, // Spacing between sections
  },
  itemSeparator: {
    height: 0.3,
    backgroundColor: SystemColor.separator.light,
    marginHorizontal: 15, // Optional: if you want separators to be inset
  },
  itemDetail: {
    fontSize: 16,
    color: SystemColor.systemGrey.light, // Example detail text color
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SystemColor.secondarySystemBackground.dark, // Matches the grouped list background color
  },
  listContentContainer: {
    paddingHorizontal: 15, // Creates an inset effect for the entire list
  },
  header: {
    backgroundColor: SystemColor.secondarySystemBackground.light, // Matches the grouped list background color
  },
  headerTitle: {
    color: SystemColor.secondaryLabel.light,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: SystemColor.secondarySystemBackground.dark,
  },
  sectionFooter: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: SystemColor.secondarySystemBackground.dark,
  },
  sectionFooterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: SystemColor.tertiaryLabel.dark,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SystemColor.systemBackground.dark,
    padding: 10,
    // Common style, no border radius here
  },
  firstItemContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastItemContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  singleItemContainer: {
    borderRadius: 10, // Full border radius for a single item
  },
  itemTitle: {
    fontSize: 16,
    color: SystemColor.label.dark,
  },
  sectionSeparator: {
    height: 5, // Spacing between sections
  },
  itemSeparator: {
    height: 1,
    backgroundColor: SystemColor.separator.dark,
    marginHorizontal: 15, // Optional: if you want separators to be inset
  },
  itemDetail: {
    fontSize: 16,
    color: SystemColor.systemGrey.dark, // Example detail text color
  },
});

const styles = {
  light: lightStyles,
  dark: darkStyles,
};

export default SettingsScreen;
