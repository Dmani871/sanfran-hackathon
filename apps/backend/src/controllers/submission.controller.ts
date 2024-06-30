import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OpenaiService } from '@/services/openai.service';
import { Submission } from '@/interfaces/submission.interface';
import { HttpException } from '@/exceptions/HttpException';
import { ContractsService } from '@/services/contracts.service';
import { CaptchaService } from '@/services/captcha.service';
import { SerialPort } from 'serialport'

const port = new SerialPort({
  path: '/dev/tty.usbmodem1101',
  baudRate: 115200
});

port.open((err) => {
  if(err) {
    console.log('Error opening port: ', err.message);
  } else {
    console.log('Port opened');
  }
});
// connect to the serial port of the POS system

export class SubmissionController {
  public openai = Container.get(OpenaiService);
  public contracts = Container.get(ContractsService);
  public captcha = Container.get(CaptchaService);

  public submitReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: Omit<Submission, 'timestamp'> = req.body;

      // if (!(await this.captcha.validateCaptcha(body.captcha))) {
      //   throw new HttpException(400, 'Invalid captcha. Please try again.');
      // }

      const submissionRequest: Submission = {
        ...body,
        timestamp: Date.now(),
      };
      console.log(submissionRequest);
      // Submission validation with smart contract
      await this.contracts.validateSubmission(submissionRequest);

      console.log('Submitted receipt');

      const validationResult = false; //
      if (true) {
        await this.contracts.registerSubmission(submissionRequest);
        res.status(200).json({
          validation: {
            isValid: true,
            descriptionOfAnalysis: 'Valid receipt well done! You have earnt ',
          },
        });
      } else {
        res.status(200).json({
          validation: {
            isValid: false,
            descriptionOfAnalysis: 'Valid receipt well done! You have earnt ',
          },
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public markAsSold = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    const data = req.body;

    if(!data.item && typeof data.item !== 'string') {
      throw new HttpException(400, 'Item not provided');
    }

    // making a nonce to add as query params
    const nonce = Math.floor(Math.random() * 1000000);

    // push a url to the serial port https://j4a.uk
    await new Promise<void>((resolve) => {
      port.write(`https://localhost:8082/claim?id=${nonce}&item=${data.item}`, undefined, (err) => {
        if(err){
          console.error(err);
        }
        resolve();
      });
    });
    // 
  }
}
