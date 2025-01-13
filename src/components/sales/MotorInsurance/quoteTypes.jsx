import PropTypes from 'prop-types';

export const createTPILICQuote = (vehicleData, policyData) => ({
  Version: "2.0",
  Request: {
    Function: "TPILICQuote",
    Vehicles: [
      {
        VRN: vehicleData.VRN,
        EntityType: "Personal",
        ClientIDType: "1",
        IDNumber: "ABCDEFGHIJ1",
        CompanyName: "",
        FirstName: "John",
        LastName: "Smith",
        MSISDN: "0771234123",
        Email: "email@ice.cash",
        BirthDate: "19800202",
        Address1: "Address line 1",
        Address2: "Address line 2",
        SuburbID: "2",
        Policy_IDNumber: "ABCDEFGHIJ2",
        Policy_CompanyName: "",
        Policy_FirstName: "Jane",
        Policy_LastName: "Smith",
        Policy_MSISDN: "0771234123",
        Policy_Email: "email@ice.cash",
        Policy_Address1: "Address line 1",
        Policy_Address2: "Address line 2",
        Policy_EntityType: "Personal",
        Policy_BirthDate: "19700101",
        InsuranceType: policyData.insuranceType,
        VehicleType: vehicleData.vehicleTypeId,
        VehicleValue: "1000",
        DurationMonths: "4",
        LicFrequency: "3",
        RadioTVUsage: policyData.RadioTVUsage,
        RadioTVFrequency: policyData.RadioTVFrequency
      }
    ]
  }
});

export const createTPIQuote = (vehicleData, policyData) => ({
  Version: "2.1",
  Request: {
    Function: "TPIQuote",
    Vehicles: [{
      VRN: vehicleData.VRN,
      EntityType: "Personal",
      IDNumber: "ABCDEFGHIJ1",
      CompanyName: "TelOne",
      FirstName: "John",
      LastName: "Smith",
      MSISDN: "0771234123",
      Email: "email@ice.cash",
      Address1: "Address line 1",
      Address2: "Address line 2",
      Town: "Town",
      BirthDate: "",
      Owner_FirstName: "Jane",
      Owner_LastName: "Smith",
      Owner_MSISDN: "0771234123",
      Owner_Email: "email@ice.cash",
      Owner_Address1: "Address line 1",
      Owner_Address2: "Address line 2",
      Owner_Town: "Town",
      Owner_BirthDate: "19900126",
      InsuranceType: policyData.insuranceType,
      VehicleType: vehicleData.vehicleTypeId,
      VehicleValue: "1000",
      DurationMonths: "4",
      CustomerReference: "Ref 1",
      Currency: "USD"
    }]
  }
});

export const createLICQuote = (vehicleData, policyData) => ({
  Version: "2.1",
  Request: {
    Function: "LICQuote",
    Vehicles: [
      {
        VRN: vehicleData.VRN,
        IDNumber: "ABCDEFGHIJ1",
        ClientIDType: "1",
        FirstName: "",
        LastName: "",
        Address1: "Address line 1",
        Address2: "Address line 2",
        SuburbID: "2",
        LicFrequency: "1",
        RadioTVUsage: policyData.RadioTVUsage,
        RadioTVFrequency: policyData.RadioTVFrequency
      }
    ]
  }
});

// PropTypes for runtime type checking
createTPILICQuote.propTypes = {
  vehicleData: PropTypes.shape({
    VRN: PropTypes.string.isRequired,
    vehicleTypeId: PropTypes.string.isRequired
  }).isRequired,
  policyData: PropTypes.shape({
    insuranceType: PropTypes.string.isRequired,
    RadioTVUsage: PropTypes.string.isRequired,
    RadioTVFrequency: PropTypes.string.isRequired
  }).isRequired
};

createTPIQuote.propTypes = {
  vehicleData: PropTypes.shape({
    VRN: PropTypes.string.isRequired,
    vehicleTypeId: PropTypes.string.isRequired
  }).isRequired,
  policyData: PropTypes.shape({
    insuranceType: PropTypes.string.isRequired
  }).isRequired
};

createLICQuote.propTypes = {
  vehicleData: PropTypes.shape({
    VRN: PropTypes.string.isRequired
  }).isRequired,
  policyData: PropTypes.shape({
    RadioTVUsage: PropTypes.string.isRequired,
    RadioTVFrequency: PropTypes.string.isRequired
  }).isRequired
};

