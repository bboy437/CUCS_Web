
export interface user {
    id: number;
    userName: string;
    customerId: string;
    customerCode: string;
    customerName: string;
    isAdmin: boolean;
    inActivated: boolean;
}

export interface GetUser {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    emailAddress: string;
    customerId: string;
    isAdmin: boolean;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface CustomerList {
    customerId: string;
    customerCode: string;
    cusomerName: string;
    address: string;
    contractPerson: string;
    telephoneNo: string;
    faxNo: string;
    provinceCode: string;
    provinceName: string;
    zipCode: string;
}

export interface ServiceRequest {
    id: number;
    customerId: string;
    repairNoteNo: string;
    repairNoteDate: Date;
    referDocNo: string;
    referDocDate: Date;
    referRepairNoteNo: string;
    referRepairNoteDate: Date;
    isSubmited: boolean;
    serialNo: string;
    equipmentDetail: string;
    informer: string;
    phoneNo: string;
    email: string;
    problemDetail: string;
    remark: string;
}

export interface ServiceRequestList {
    id: number;
    jobOrderNo: string;
    jobOrderDate: Date;
    serialNo: string;
    equipmentDetail: string;
    currentStep: string;
    lastUpdateDate: Date;
    lastStatus: string;
    informer: string;
}

export interface Service {
    jobOrderNo: string;
    jobOrderDate: Date;
    referDocNo: string;
    referDocDate: Date;
    referJobOrderNo: string;
    referJobOrderDate: Date;
    serialNo: string;
    equipmentDetail: string;
    informer: string;
    telephoneNo: string;
    emailAddress: string;
    installLocation: string;
    address: string;
    provinceName: string;
    zipCode: string;
    problemDetail: string;
    remark: string;
    currentStep: string;
    lastUpdateDate: Date;
    lastStatus: string;
    performOrderDate: Date;
    startWorkDate: Date;
    endWorkDate: Date;
    solution: string;
}

export interface SerialNoList {
    serailNo: string;
    customerId: string;
    contractId: string;
    equipmentId: string;
    deptId: string;
    divisionId: string;
}
