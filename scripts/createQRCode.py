#!/usr/bin/env python
# -*- coding: utf-8 -*-

import qrcode
from datetime import date
from pathlib import Path

def createQR():
  today = date.today().strftime('%Y-%m-%d')
  Path("./tmp/qrcode").mkdir(parents=True, exist_ok=True)

  qr = qrcode.QRCode(
    version=12,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=1,
    border=5
  )

  qr.add_data('https://raphaelbittan.github.io/')
  qr.make()
  img = qr.make_image(fill_color="#23dda0", back_color="white")
  filename = 'qr_'+today+'.png'
  filepath = './tmp/qrcode/'
  fileimg = filepath+filename
  img.save(fileimg)
  print('QR Code '+filename+' CREATED at '+filepath)

if __name__ == '__main__':
  createQR()
