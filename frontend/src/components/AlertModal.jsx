import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";


const AlertModal = ({ onSubmit }) => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [threshold, setThreshold] = useState("");

    const handleOpen = () => setOpen((cur) => !cur);

    const handleSubmit = () => {
        onSubmit({ email, city, threshold });
        setEmail("");
        setCity("");
        setThreshold("");
        handleOpen();
    };

    return(
    <>
        <Button onClick={handleOpen}>Set Weather Alert</Button>
        <Dialog
            size="md"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
        >
            <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <Typography variant="h4" color="blue-gray">
                        Set Weather Alert
                    </Typography>
                </div>
                <Typography className="mb-3 font-normal" variant="paragraph" color="gray">
                Enter the details below to set your weather alert.
                </Typography>
                <Typography className="-mb-2" variant="h6">
                City
                </Typography>
                <Input
                label="City"
                size="lg"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
                <Typography className="-mb-2" variant="h6">
                Threshold Temperature
                </Typography>
                <Input
                label="Threshold Temperature"
                type="number"
                size="lg"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                />
                <Typography className="-mb-2" variant="h6">
                Email
                </Typography>
                <Input
                label="Email"
                size="lg"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </CardBody>
            <CardFooter className="pt-0">
                <Button variant="outlined" color="gray" onClick={handleOpen} fullWidth>
                Cancel
                </Button>
                <Button variant="gradient" onClick={handleSubmit} fullWidth>
                Set Alert
                </Button>
            </CardFooter>
            </Card>
        </Dialog>
    </>
    );
}

export default AlertModal;