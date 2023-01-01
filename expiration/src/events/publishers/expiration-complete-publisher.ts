import { Subjects, Publisher, ExpirationCompleteEvent } from "@mpena/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}