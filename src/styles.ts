import { StyleSheet } from 'react-native';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';

const COLORS = {
  'dark-green': '#8ed7b8',
  white: '#fff',
  'light-green': '#b4dfcd',
  'dark-text-green': '#283c33',
  'input-stroke': '#649580',
  'input-text': 'rgba(0, 0, 0, 0.5)',
  divider: 'rgba(0, 0, 0, 0.33)',
  black: '#000',
  bg: '#f2f2f2',
};

const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    backgroundColor: COLORS.bg,
  },
  flexContainer: {
    flex: 1,
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: COLORS['light-green'],
    ...SHADOWS.light,
  },
  icon: {
    paddingLeft: 6,
    width: 36,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: COLORS['input-text'],
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    ...SHADOWS.light,
  },
  listItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  modalContent: {
    width: 200,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    ...SHADOWS.medium,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spaceItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  spaceItemImage: {
    height: 58,
    width: 58,
    backgroundColor: COLORS['light-green'],
    marginRight: 18,
    borderRadius: 8,
  },
  spaceItemAllText: {
    flex: 1,
  },
  spaceItemTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  spaceItemDesc: {
    color: '#49454F',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  iconContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: COLORS['light-green'],
    borderRadius: 12,
    ...SHADOWS.medium,
  },
  addItemText: {
    color: COLORS['dark-text-green'],
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  pathLink: {
    color: '#65558F',
    textDecorationLine: 'underline',
  },
  itemPopupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 65,
    paddingRight: 90,
  },
  itemPopupContent: {
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: COLORS['input-stroke'],
    borderRadius: 12,
    padding: 16,
    gap: 8,
    width: 250,
  },
  itemPopupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomColor: '#CAC4D0',
  },
  addItemContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  addItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CAC4D0',
  },
  itemPopupText: {
    fontSize: 16,
    color: '#49454F',
  },
  backButton: {
    fontSize: 16,
    color: '#49454F',
    padding: 10,
  },
  addItemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#49454F',
    textAlign: 'center',
    marginVertical: 10,
  },
  addItemForm: {
    padding: 20,
  },
  numberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#65558F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 3,
  },
  divider: {
    marginTop: 3,
    height: 1,
    backgroundColor: COLORS.divider,
    width: '100%',
  },
});
export { styles, COLORS };
