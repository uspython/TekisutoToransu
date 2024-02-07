import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {I18n} from 'res';
const settingsData = [
  {
    title: I18n.t('general'),
    data: [
      {
        key: '1',
        title: I18n.t('quick_start_camera'),
        type: 'switch',
        switchOn: false,
      },
    ],
    footer: I18n.t('quick_start_camera_captain'),
  },
  {
    title: null,
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

const Item = ({item, isFirst, isLast}) => {
  // Determine the item style based on its position or if it's the only item in the section
  const itemStyle = [
    styles.itemContainer,
    isFirst && isLast ? styles.singleItemContainer : null, // Apply full border radius if only one item
    isFirst && !isLast && styles.firstItemContainer, // Top border radius for the first item
    isLast && !isFirst && styles.lastItemContainer, // Bottom border radius for the last item
  ];

  switch (item.type) {
    case 'text':
      return (
        <View style={itemStyle}>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
      );
    case 'switch':
      return (
        <View style={itemStyle}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Switch value={item.switchOn} />
        </View>
      );
    case 'textDetail':
      return (
        <View style={itemStyle}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDetail}>{item.detail}</Text>
        </View>
      );
    default:
      return <View />;
  }
};

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        stickySectionHeadersEnabled={false}
        sections={settingsData}
        keyExtractor={item => item.key}
        renderItem={({item, section, index}) => {
          const isFirst = index === 0;
          const isLast = index === section.data.length - 1;
          return <Item item={item} isFirst={isFirst} isLast={isLast} />;
        }}
        renderSectionHeader={({section: {title}}) => {
          if (title) {
            return <Text style={styles.sectionHeader}>{title}</Text>;
          }
        }}
        renderSectionFooter={({section: {footer}}) => {
          if (footer) {
            return (
              <View style={styles.sectionFooter}>
                <Text style={styles.sectionFooterText}>{footer}</Text>
              </View>
            );
          }
        }}
        contentContainerStyle={styles.listContentContainer}
        SectionSeparatorComponent={() => (
          <View style={styles.sectionSeparator} />
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4', // Matches the grouped list background color
  },
  listContentContainer: {
    paddingHorizontal: 15, // Creates an inset effect for the entire list
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#EFEFF4',
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
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  },
  sectionSeparator: {
    height: 20, // Spacing between sections
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#EFEFF4',
    marginHorizontal: 15, // Optional: if you want separators to be inset
  },
  itemDetail: {
    fontSize: 16,
    color: '#6e6e6e', // Example detail text color
  },
});

export default SettingsScreen;
