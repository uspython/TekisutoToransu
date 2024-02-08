import {useQuickCamera} from 'hook';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import {I18n, SystemColor} from 'res';


const Item = ({item, isFirst, isLast}) => {
  const colorSchema = useColorScheme();
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
        <View style={itemStyle}>
          <Text style={styles[colorSchema].itemTitle}>{item.title}</Text>
          <Text style={styles[colorSchema].itemDetail}>{item.detail}</Text>
        </View>
      );
    default:
      return <View />;
  }
};

const SettingsScreen = () => {
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
            await setQuickCamera(result)
          },
        },
      ],
      footer: I18n.t('quick_start_camera_captain'),
    },
    {
      title: ' ',
      data: [
        {
          key: '1',
          title: I18n.t('quick_start_camera'),
          type: 'text',
          detail: 'John Doe',
        },
        {key: '2', title: 'Airplane Mode', type: 'switch', switchOn: false},
        {key: '3', title: 'Wi-Fi', type: 'textDetail', detail: 'Not Connected'},
      ],
      footer: null,
    },
    {
      title: 'Privacy',
      data: [
        {key: '7', title: 'Terms', type: 'text', detail: 'Enabled'},
        {key: '8', title: 'Privacy', type: 'switch', switchOn: true},
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
  }, [isQuickCamera]);

  return (
    <SafeAreaView style={styles[colorSchema].container}>
      <SectionList
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={item => item.key}
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
  },
  listContentContainer: {
    paddingHorizontal: 15, // Creates an inset effect for the entire list
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
    height: 20, // Spacing between sections
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
    height: 20, // Spacing between sections
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
