#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import date
import os
import glob
import json
import shutil
from zipfile import ZipFile


def determineIconSet():
  zipName = get_zip_name()
  if len(zipName) > 1:
    dirPath = './src/img/logo'
    fileList = []
    imgList = []
    if os.path.isfile(dirPath+'/'+zipName+'.zip'):
      if os.path.isdir(dirPath):
        if check_for_files(dirPath+'/apple-touch-icon*.png'):
          imgList = glob.glob(dirPath+'/apple-touch-icon*.png')
          fileList.append(imgList)
          if check_for_files(dirPath+'/favicon.ico'):
            imgList = glob.glob(dirPath+'/favicon.ico')
            fileList.append(imgList)
          if check_for_files('./favicon.ico'):
            imgList = glob.glob('./favicon.ico')
            fileList.append(imgList)
          print('\nREMOVING PREVIOUS ICON SET >\n')
          for filePath in fileList:
            try:
              if isinstance(filePath, list):
                for fileName in filePath:
                  print(fileName)
                  os.remove(fileName)
              else:
                print(filePath)
                os.remove(filePath)
            except OSError:
              print('ERROR: CANNOT REMOVE FILE > '+filePath)

        if check_for_files(dirPath+'/'+zipName+'.zip'):
          if os.path.isdir(dirPath+'/'+zipName):
            print('\nCREATING NEW ICON SET >\n')
            cp_files(dirPath, zipName)
          else:
            print('\nCREATING NEW ICON SET >\n')
            with ZipFile(dirPath+'/'+zipName+'.zip', 'r') as zipObj:
              zipObj.extractall(dirPath)
            cp_files(dirPath, zipName)

          createManifestJSON()
      else:
        print('ERROR: SRC DIR NOT FOUND > '+dirPath)
    else:
      print('ERROR: ZIP NOT FOUND > '+dirPath+'/'+zipName+'.zip')


def get_zip_name():
  # year = date.today().strftime('%Y')
  month = date.today().strftime('%m')
  day = date.today().strftime('%d')
  monthday = month+'-'+day
  # fulldate = year+'-'+month+'-'+day

  if monthday == '05-04':
    print('\nNEW ICON SET DETECTED >\n')
    zipTarget = 'r2d2'
    print('''
          /     /  \\    \\       8888888888  888    88888              ===,
          |    |><> |   |     88     88   88 88   88  88            @o o@)
          |    (/\\__)   |      8888  88  88   88  88888              \\- /
          |   /      \\  |         88 88 888888888 88   88          /~~  ~~\\
          |   ||/(===o  |  88888888  88 88     88 88    888888    / (   )  \\
          |   | /  \\ |  |                                        /_/\\    /\\_|
          |   \\/][][\\/  |  88  88  88   888    88888    888888   ||  \\  // ||
          |    |\\  /|   |  88  88  88  88 88   88  88  88         @  | | | @
          |    |_||_|   |  88 8888 88 88   88  88888    8888         | | |
          |    [ ][ ]   |   888  888 888888888 88   88     88        | | |
          |    | || |   |    88  88  88     88 88    8888888        /  |  \\
          |    | || |   |                                           ~~~~~~~
    ______|___/__][_]___|___________________________________________/__)(_)__________
    ''')
  elif monthday == '04-20':
    print('\nNEW ICON SET DETECTED >\n')
    zipTarget = '420'
    print('''
                                                  |      -----| |----|
                                                  |           | |    |
                                                  ----|- |----| |    |
                                                      |  |      |    |
                                                      |  |----- |----|

                              011110111000111110101011011100100010000111011000110101110011
                                    111111010101111101110101101001111000111100111100
                                          11111001110101111101110111011011011
                                1101100101100001011100101011110011110101110101101011000
                          1000101000011        1110001011010111100001101          000101000011
                      110100001110           110110000    1111    11000100           10100001110
                    001001100            0010001111       1101       001011110            001001100
                11000001             11111100010          1110          11101110001             111000001
              0011001           110100111011              1100             1100001001111           0011001
            0011111011010010011111101101                  0110                 1000100010000111111100100011
            00111001011000101111000                       1111                       0101111010111000101000
                                                          1000
                                                          0000
                                                          0110
    ''')
  else:
    print('\nNEW ICON SET DETECTED >\n')
    zipTarget = 'og'
    print('''
                                        :/:--/+///++::::/+/-
                                     :+shhhhhddhhhhhdhyyhhhy++
                                  :+ohdddddmddmmmmmmmmmmmmdddho-
                                  :shhmmmmmmmmmmmNNmmmNNmmmmmmmmdy/-
                               ssdmmmmmNNNNNNNNNNNNNNNNNNNNNmmmmdhs:
                             /sddmmmNNNNNNNNNNNNNNNNNNmNmNNNNmNNNmmho:
                            :ydmmmNNNNNNNNNNNmmmmmmmdddddddmmmmNNNmmdh/
                            odmmmmNNNNNNNmmddhhyyyssssssssyyhhddmmNNmmh:
                           odmmmmmNNmmddhhyysssssoooooooooosssyyyhdNNmdy/:
                        /ohdmNNNNmmmhhyyysssoooooo++++++++++ooosssydNNmdy/
                        odmmNNmNNmdhyyssssooooo++++++++++++++oooossymNmmds:
                        odmNNNmmdhyysssssooo++++++++++++++++++oooooydNmmmd/
                        /hmNNNdyysssssssso+++++++++++++///+++++o++osdmNmmd/
                         omNNNdyssssssssoo++++++++++++++++++++++++osdNNmmy:
                         /mmNNmhsssssssooooooooo+o+ooosssyyyyssssoooymNNms-
                          omNNNhsssyhhhdddddhhysoooosyhhhdddhhhyyysoshNNd/:
                           ymNNhssyhhhhhhhhhhhyyssoosyyyhhdddhhysssoosmmy/-
                          :ymNNyssyyyhddmmmhdhhyys++syyhhymmmhhdhysooohmys:
                        :+ohmNNysssyhdhhdddhhhhhyo//osyyhyyyyyyyyssoooymys::
                           ydmNysssyyyyyyhhhhhyyso//ossyyyyyssssooooooshss:-
                           oyhmyssssssyyyyyyyyyyso+/+oossssssssoooooooohys::
                           /yshysssssssyysssssyso++/++ossssooooooooooooyso::
                            syyssssssssssssssssooo++++oosssooooooooooosso/:::
                            /ssysssssssssssssyyyyssoosyysssooo+oooooooso+/:::
                            //oyyssssssssssyyyyhhhyysyyysssooooooooosss::::
                               /syssssssssyyyyyhhhhhhhhhyyssssooooossy+::
                                :yyyyysssyyhhyyhhyyyyyyyyyyyyysooossys::              ___   __ _
                                 /yhyyyyyhhhhhhddddhhhhhhhhyyyssssyyy/::             / _ \\ / _` |
                                  +yhyyyyyhhhhhhhhhhhhyyyyssyyssyyyyo:              | (_) | (_| |
                                   /yhhhyyhhyyyyyyyhyyysssssyhyyyyyo:                \\___/ \\__, |
                                    /hhhhhdhyyyyyyyyyyssssssyhhyyys:                       |___/
                                     syhyhhhhhyyyyyyyyyyyyyyhhhyyso/:
                                     ssyyhhhdhhhhhhhhyyhhhhhhhhssso/:
                                   /sssyyhddddhdhhhhhhhhhhdhyyssoo/::
                               :/ooossssyyyyhdddddddddddddhysssssoo+::::
                             :+yyssssssyyyyyyyyhhhhhhhhyyyssssssoooo//::::::
                             /yyssssssssssyyyyyyyyyysyyssssssooooooooooo+:::::
                  ;..----:-:/yyssssssssssyyyyyyyyyyysssssssssooooooooooss/::::::
            ;......-.----/-:/yyyssssssssssssssssssssssssoosooooooooooooos+:::::::::
     :---..............---/::/syyssssssssssssssssssssssssoooooooooooooooooo:::::-----:::
  ::---..............-----:::/oyyysssssssssssssssssssssssooooooooooooooooss::::::--....--::
-------..............----::/::/hyyssssssssssssssssssssssoooooooooooooooooyo:::::::--......--::
....--..............----:::///:yyyysssssssssssssssssssssoooooooooooooooosy+::::::---.........-------
.------------------------::////syyyyysssssssssssssssssssooooooooooooooosyy:::::::---.............---
.-::--..----.---.----..---::///+hyyyyyyssssssssssssoossooooooooooosssssyy///::::::--...............-
-------.------------------:::///syyyyyysssssssssssssssssssssssssssssssyo::/::::::::--...............
---------------------------:::://+shyyyssssyyyyyyyyyhyyyyhyysyyyysssso//://:::::::-------...........
----:-----------------------:::://++osyyysyyyyyyyyyhhhhhhhyyyyysyso+///////::::::::----...-----.....
----:------------------------:::://++++++oossyyhhhhdddddhdhysso+////////:::::::::::-----....---.--.-
    ''')

  return zipTarget


def check_for_files(filepath):
  for filepath_object in glob.glob(filepath):
    if os.path.isfile(filepath_object):
      return True

  return False


def cp_files(dirPath, zipName):
  files = os.listdir(dirPath+'/'+zipName)
  for f in files:
    if f == 'favicon.ico':
      print(dirPath+'/'+f)
      shutil.move(dirPath+'/'+zipName+'/'+f, dirPath+'/')
      print('./'+f)
      shutil.copy(dirPath+'/favicon.ico', './favicon.ico')
    else:
      print(dirPath+'/'+f)
      shutil.move(dirPath+'/'+zipName+'/'+f, dirPath+'/')
  shutil.rmtree(dirPath+'/'+zipName, ignore_errors=True)


def createManifestJSON():
  # today = date.today().strftime('%Y-%m-%d')
  print('\nMANIFEST UPDATED !\n')

  data = {}
  data['name'] = 'A DevOps Journey'
  data['short_name'] = 'rb.io'
  data['description'] = 'Personal Static Website'
  data['start_url'] = '/?source=pwa'
  data['scope'] = '/'
  data['icons'] = []
  data['icons'].append({
    'src': 'assets/img/logo/favicon.ico',
    'sizes': '32x32',
    'type': 'image/x-icon'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-57x57.png',
    'sizes': '57x57',
    'type': 'image/png'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-72x72.png',
    'sizes': '72x72',
    'type': 'image/png'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-76x76.png',
    'sizes': '76x76',
    'type': 'image/png'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-114x114.png',
    'sizes': '114x114',
    'type': 'image/png'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-120x120.png',
    'sizes': '120x120',
    'type': 'image/png'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-144x144.png',
    'sizes': '144x144',
    'type': 'image/png'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-152x152.png',
    'sizes': '152x152',
    'type': 'image/png'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-180x180.png',
    'sizes': '180x180',
    'type': 'image/png'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-192x192.png',
    'sizes': '192x192',
    'type': 'image/png',
    'purpose': 'any maskable'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-196x196.png',
    'sizes': '196x196',
    'type': 'image/png',
    'purpose': 'any maskable'
  })
  data['icons'].append({
    'src': 'assets/img/logo/apple-touch-icon-512x512.png',
    'sizes': '512x512',
    'type': 'image/png',
    'purpose': 'any maskable'
  })
  data['lang'] = 'en'
  data['dir'] = 'ltr'
  data['display'] = 'standalone'
  data['orientation'] = 'natural'
  data['theme_color'] = '#000000'
  data['background_color'] = '#ffffff'
  data['url'] = 'https://raphaelbittan.github.io'
  data['screenshots'] = []
  data['generated'] = ''

  # with open('manifest-'+today+'.json', 'w+') as outfile:
  with open('manifest.json', 'w+') as outfile:
    json.dump(data, outfile)


if __name__ == '__main__':
  determineIconSet()
