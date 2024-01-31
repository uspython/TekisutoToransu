# -*- utf-8 -*-

import csv
import os
import json
import shutil
import argparse

INDEX_VER = 0
INDEX_COMMENT = 1
INDEX_SCOPE_ID = 2
# FIXME: (Jeff) watch out! i18n file column order MUST be the same as followings:
LAN_INDEX = {
    "en": 3,
    "zh": 4,
    "ja": 5,
}


def parse_i18n_csv(filepath, lans):
    line_count = 0
    trans_count = 0
    with open(filepath, newline='') as csvfile:
        filereader = csv.reader(csvfile)
        for row in filereader:
            if line_count > 0:
                #
                key = row[INDEX_SCOPE_ID]
                #key = '_'.join(filter(None, [scope_id]))
                if key != '':
                    for lan, col in LAN_INDEX.items():
                        if lan not in lans:
                            lans[lan] = {}
                        translation = row[col]
                        if translation and (len(translation) > 0):
                            if key not in lans[lan]:
                                lans[lan][key] = translation
                                trans_count += 1
                            else:
                                raise Exception(
                                    "{} is alreay added, {}".format(key, translation))
                else:
                    raise Exception("row is empty")
            else:
                # first line
                pass
            line_count += 1
        print("handle {} items".format(trans_count))


def export_i18n_lan_files(pathdir, lans):
    if not os.path.isdir(pathdir):
        os.mkdir(pathdir)
    for lan, translations in lans.items():
        if len(translations) > 0:
            with open("{}/{}.ts".format(pathdir, lan), 'w') as lan_js_file:
                lan_js_file.write(
                    "/* eslint-disable @typescript-eslint/camelcase */\n")
                lan_js_file.write("export const {} = {{\n".format(lan))
                for key, translation in translations.items():
                    lan_js_file.write("  {}: `{}`,\n".format(
                        key.replace("\n", ""), translation.replace("\n", "")))
                lan_js_file.write("};")


def export_i18n_lan_keys_file(pathdir, lans):
    keys = set()
    for lan, translations in lans.items():
        if len(translations) > 0:
            for key in translations.keys():
                keys.add(key)
    key_list = list(keys)
    key_list.sort()
    with open("{}/keys.ts".format(pathdir), 'w') as keys_js_file:
        keys_js_file.write(
            "/* eslint-disable @typescript-eslint/camelcase */\n")
        keys_js_file.write("export enum I18nLangKey {\n")
        for key in key_list:
            keys_js_file.write("  {} = \"{}\",\n".format(key, key))
        keys_js_file.write("};")


def export_i18n_index_file(pathdir, lans):
    with open("{}/index.ts".format(pathdir), 'w') as index_js_file:
        available_lans = []
        for lan in lans.keys():
            if os.path.isfile("{}/{}.ts".format(pathdir, lan)):
                available_lans.append(lan)
        index_js_file.write("import I18n from 'i18n-js';\n")
        index_js_file.write(
            "import * as RNLocalize from 'react-native-localize';\n")
        for lan in available_lans:
            index_js_file.write(
                "import {{ {} }} from './{}';\n".format(lan, lan))
        index_js_file.write("export * from './keys';\n")
        index_js_file.write("I18n.fallbacks = true;\n")
        index_js_file.write("I18n.translations = {\n")
        for lan in available_lans:
            index_js_file.write("  {},\n".format(lan))
        # brazil pt
        index_js_file.write("  br: pt,\n")

        index_js_file.write("};\n")
        index_js_file.write(
            "const [{ languageCode }] = (RNLocalize.getLocales() || [{ languageCode: 'en' }]);\n\n")
        index_js_file.write("I18n.locale = languageCode;\n")
        index_js_file.write("export default I18n;\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", help="xml dir", default=".")
    parser.add_argument("--output", help="output dir",
                        default="../src/res/i18n")
    parser.add_argument("--verbose", help="verbose",
                        default=False, action="store_true")
    args = parser.parse_args()

    lans = {}
    parse_i18n_csv(
        "{}/JTextTransConfiguration - JTextTrans Configuration - i18n.csv".format(args.input), lans)

    shutil.rmtree(args.output)
    export_i18n_lan_files(args.output, lans)
    export_i18n_lan_keys_file(args.output, lans)
    export_i18n_index_file(args.output, lans)
