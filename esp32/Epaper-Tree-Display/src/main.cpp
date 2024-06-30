#include <Arduino.h>
#include "epd_driver.h"
#include "pins.h"
#include "qrcode.h"

uint8_t *framebuffer = NULL;

Rect_t qr_code_area = {
  .x = 0,
  .y = 0,
  .width = EPD_WIDTH,
  .height = EPD_HEIGHT
};

void setup() {
    Serial.begin(115200);

    Serial.println("e-Paper Init and Clear...");
    delay(1000);
    framebuffer = (uint8_t *)ps_calloc(sizeof(uint8_t), EPD_WIDTH * EPD_HEIGHT / 2);
    if (!framebuffer) {
        Serial.println("alloc memory failed !!!");
        while (1);
    }
    memset(framebuffer, 0xFF, EPD_WIDTH * EPD_HEIGHT / 2);

    Serial.println("e-Paper Init and Clear...");
    epd_init();

    epd_poweron();
    epd_clear();

    delay(1000);
}

// Helper function to set a pixel in the framebuffer
void setPixel(int x, int y, uint8_t color) {
    int byteIndex = (y * EPD_WIDTH + x) / 2;
    if (x % 2 == 0) {
        framebuffer[byteIndex] = (framebuffer[byteIndex] & 0xF0) | (color & 0x0F);
    } else {
        framebuffer[byteIndex] = (framebuffer[byteIndex] & 0x0F) | (color << 4);
    }
}

// Function to display the QR code
void Display_QRcode(int offset_x, int offset_y, const char* Message) {
  #define element_size 18
  QRCode qrcode;
  uint8_t qrcodeData[qrcode_getBufferSize(3)];
  qrcode_initText(&qrcode, qrcodeData, 3, 0, Message);

  // Print out the QR code to the serial monitor
  for(int y = 0; y < qrcode.size; y++) {
    for(int x = 0; x < qrcode.size; x++) {
      Serial.print(qrcode_getModule(&qrcode, x, y) ? "##" : "  ");
    }
    Serial.println();
  }
  
  // Draw the QR code in the framebuffer
  for (int y = 0; y < qrcode.size; y++) {
    for (int x = 0; x < qrcode.size; x++) {
      uint8_t color = qrcode_getModule(&qrcode, x, y) ? 0x00 : 0x0F; // 0x00 for black, 0x0F for white
      for (int i = 0; i < element_size; i++) {
        for (int j = 0; j < element_size; j++) {
          setPixel(x * element_size + i + offset_x, y * element_size + j + offset_y, color);
        }
      }
    }
  }
}

void loop() {
  // Wait until there is data available in the serial buffer
  while (Serial.available() == 0) {
    // Do nothing, just wait for serial input
    delay(1);
  }

  // Read the input string from the serial port
  String inputString = Serial.readStringUntil('\n');

  // Clear the framebuffer
  memset(framebuffer, 0xFF, EPD_WIDTH * EPD_HEIGHT / 2);
  epd_clear();
  // Generate and display QR code for the input string
  Display_QRcode(0, 0, inputString.c_str());
  epd_draw_grayscale_image(qr_code_area, framebuffer);

  // Add a delay to avoid updating too frequently
  delay(10000);
}
