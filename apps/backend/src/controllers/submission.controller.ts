import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OpenaiService } from '@/services/openai.service';
import { Submission } from '@/interfaces/submission.interface';
import { HttpException } from '@/exceptions/HttpException';
import { ContractsService } from '@/services/contracts.service';
import { CaptchaService } from '@/services/captcha.service';

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
}
