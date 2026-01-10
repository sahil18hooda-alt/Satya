export interface Section {
    title: string;
    content: string[];
    subsections?: { title: string; items: string[] }[];
}

export interface DisabilityCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
    subcategories?: string[];
    info: {
        registration: Section;
        pollingFacilities: Section;
        companionRights: Section;
        postalBallot: Section;
        helplines: Section;
        specialProvisions: Section;
        governmentInitiatives: Section;
        yourRights: Section;
        preElectionChecklist: Section;
        contacts: Section;
    };
}

export const disabilityCategories: DisabilityCategory[] = [
    {
        id: "visual",
        name: "Visual Impairment / Blindness",
        icon: "👁️",
        description: "For persons with complete blindness, low vision, or partial blindness",
        subcategories: ["Complete blindness", "Low vision", "Partial blindness"],
        info: {
            registration: {
                title: "Registration & Documentation",
                content: [
                    "You can register as a voter with disability marking on your EPIC (Electoral Photo Identity Card).",
                    "The disability marking ensures polling staff are aware and can provide appropriate assistance.",
                ],
                subsections: [
                    {
                        title: "Required Documents",
                        items: [
                            "Disability certificate issued by competent medical authority (40% or above disability)",
                            "Valid ID proof (Aadhaar, PAN, Passport, Driving License)",
                            "Address proof (if different from ID)",
                            "Recent passport-size photograph",
                        ],
                    },
                    {
                        title: "How to Register",
                        items: [
                            "Visit National Voters' Service Portal (NVSP): www.nvsp.in",
                            "Fill Form 6 for new registration or Form 8 for corrections",
                            "Upload disability certificate in the designated field",
                            "Submit online or visit your local Electoral Registration Officer (ERO)",
                            "For home-based registration: Contact your Booth Level Officer (BLO) for assistance",
                        ],
                    },
                ],
            },
            pollingFacilities: {
                title: "Voting Facilities at Polling Stations",
                subsections: [
                    {
                        title: "Physical Accessibility",
                        items: [
                            "All polling stations must be on ground floor or have ramp access",
                            "Wheelchairs available at polling stations",
                            "Reserved parking spaces near entrance",
                            "Volunteers to assist from vehicle to polling booth",
                        ],
                    },
                    {
                        title: "Special Facilities for Visually Impaired Voters",
                        items: [
                            "**Braille Tactile Templates**: Placed over EVM ballot units to help identify candidates",
                            "**Braille Signage**: Directions and instructions in Braille at polling stations",
                            "**Magnifying Glasses**: Available for voters with low vision",
                            "**Audio Guidance**: Some polling stations have audio instructions",
                            "**Companion Assistance**: You can bring one companion of your choice inside the voting booth",
                            "**Priority Entry**: Separate queue to avoid long waiting times",
                        ],
                    },
                ],
            },
            companionRights: {
                title: "Companion/Assistant Rights",
                content: [
                    "As a visually impaired voter, you have the right to bring ONE companion of your choice (above 18 years) to assist you.",
                    "Your companion can accompany you inside the voting booth and help you cast your vote.",
                ],
                subsections: [
                    {
                        title: "Companion Declaration Process",
                        items: [
                            "Inform the Presiding Officer that you need companion assistance",
                            "Your companion will sign a declaration form (Form 14A) maintaining confidentiality",
                            "The companion cannot be a candidate or their agent in that election",
                            "Your vote remains secret - the companion is bound by confidentiality",
                        ],
                    },
                ],
            },
            postalBallot: {
                title: "Postal Ballot Facility",
                content: [
                    "If you have 80% or more disability (as per disability certificate), you are eligible for postal ballot.",
                    "This allows you to vote from home without visiting the polling station.",
                ],
                subsections: [
                    {
                        title: "How to Apply",
                        items: [
                            "Fill Form 12D (available on NVSP or from ERO office)",
                            "Submit at least 7 days before the election date",
                            "Attach copy of disability certificate showing 80%+ disability",
                            "Provide current address for ballot delivery",
                        ],
                    },
                    {
                        title: "Postal Ballot Process",
                        items: [
                            "Ballot papers will be sent to your registered address",
                            "Mark your choice on the ballot paper",
                            "Place it in the envelope provided",
                            "Sign the declaration on the envelope",
                            "Electoral officials will collect it from your home (in most cases)",
                            "Or you can mail it back to the Returning Officer before deadline",
                        ],
                    },
                ],
            },
            helplines: {
                title: "Helpline & Support Services",
                subsections: [
                    {
                        title: "National Helplines",
                        items: [
                            "**National Voters' Helpline**: 1950 (toll-free)",
                            "**Email**: complaints@eci.gov.in",
                            "**Voter Helpline App**: Download from Play Store/App Store",
                        ],
                    },
                    {
                        title: "Accessibility Support",
                        items: [
                            "Request for Braille voter slips",
                            "Arrange home-based registration",
                            "Report inaccessible polling stations",
                            "Request companion assistance in advance",
                            "File complaints about denied facilities",
                        ],
                    },
                ],
            },
            specialProvisions: {
                title: "Special Provisions & Rights",
                content: [
                    "The Election Commission of India has made several special provisions to ensure your voting rights:",
                ],
                subsections: [
                    {
                        title: "Your Entitlements",
                        items: [
                            "**Free Transport**: Many states arrange free transport to polling stations for PwDs",
                            "**PwD Voter Slip**: Special marking on voter slip for priority treatment",
                            "**Voter Assistance Centers**: At district level for registration and query resolution",
                            "**Home-Based Facilitation**: For severely disabled voters who cannot travel",
                            "**Complaint Mechanism**: Dedicated channels to report accessibility violations",
                        ],
                    },
                ],
            },
            governmentInitiatives: {
                title: "Recent Government Initiatives",
                subsections: [
                    {
                        title: "Accessible India Campaign (Sugamya Bharat Abhiyan)",
                        items: [
                            "All polling stations being made accessible under this campaign",
                            "Ramps, tactile paths, and accessible toilets being installed",
                            "Regular audits of polling station accessibility",
                        ],
                    },
                    {
                        title: "ECI's 'No Voter Left Behind' Commitment",
                        items: [
                            "Model polling stations with enhanced accessibility features",
                            "Training programs for polling staff on disability sensitivity",
                            "Technological innovations like improved tactile EVMs",
                            "Partnerships with disability organizations for voter awareness",
                        ],
                    },
                ],
            },
            yourRights: {
                title: "Know Your Rights",
                content: [
                    "Your voting rights are protected by the Constitution of India and specific disability laws:",
                ],
                subsections: [
                    {
                        title: "Legal Protections",
                        items: [
                            "**Article 326**: Universal adult suffrage - every citizen has the right to vote",
                            "**RPWD Act 2016**: Rights of Persons with Disabilities Act mandates accessible voting",
                            "**ECI Guidelines**: Specific instructions for accessibility at all polling stations",
                            "**Right to Accessible Information**: All election-related information must be available in accessible formats",
                            "**Right to Vote Independently**: With assistance if needed, while maintaining secrecy",
                            "**Right to Complaint**: If facilities are not provided or rights are violated",
                        ],
                    },
                ],
            },
            preElectionChecklist: {
                title: "Pre-Election Checklist",
                subsections: [
                    {
                        title: "Before Election Day",
                        items: [
                            "✓ Verify your name is in the electoral roll (check on NVSP)",
                            "✓ Check your polling station location and accessibility",
                            "✓ Apply for postal ballot if eligible (at least 7 days in advance)",
                            "✓ Arrange a companion if needed and inform them about the process",
                            "✓ Note down helpline numbers: 1950",
                            "✓ Plan transportation to polling station",
                            "✓ Keep disability certificate and ID proof ready",
                            "✓ Request Braille voter slip if needed",
                        ],
                    },
                ],
            },
            contacts: {
                title: "Contact & Support",
                subsections: [
                    {
                        title: "Key Contacts",
                        items: [
                            "**District Election Officer (DEO)**: Contact your district DEO for local assistance",
                            "**Booth Level Officer (BLO)**: Your BLO can help with registration and polling station queries",
                            "**Nodal Officer for PwD**: Each district has a nodal officer specifically for disability issues",
                            "**State Election Commission**: For state-level elections",
                            "**Legal Aid**: District Legal Services Authority if rights are denied",
                        ],
                    },
                    {
                        title: "NGO Partners",
                        items: [
                            "National Association for the Blind (NAB)",
                            "All India Confederation of the Blind (AICB)",
                            "Local disability rights organizations in your area",
                        ],
                    },
                ],
            },
        },
    },
    {
        id: "physical",
        name: "Physical Disabilities",
        icon: "♿",
        description: "For persons with locomotor disability, wheelchair users, limb impairment, cerebral palsy",
        subcategories: [
            "Locomotor disability",
            "Wheelchair users",
            "Limb impairment",
            "Dwarfism",
            "Cerebral palsy",
        ],
        info: {
            registration: {
                title: "Registration & Documentation",
                content: [
                    "Register as a voter with disability marking to ensure polling stations are prepared for your needs.",
                ],
                subsections: [
                    {
                        title: "Required Documents",
                        items: [
                            "Disability certificate (40% or above)",
                            "Valid ID proof",
                            "Address proof",
                            "Recent photograph",
                        ],
                    },
                    {
                        title: "Registration Process",
                        items: [
                            "Online: www.nvsp.in (Form 6 for new, Form 8 for corrections)",
                            "Offline: Visit ERO office or request home visit from BLO",
                            "Ensure disability marking is added to your EPIC",
                        ],
                    },
                ],
            },
            pollingFacilities: {
                title: "Voting Facilities at Polling Stations",
                subsections: [
                    {
                        title: "Wheelchair Accessibility",
                        items: [
                            "**Ground Floor Polling**: All booths must be on ground floor",
                            "**Ramps**: Proper gradient ramps (1:12 ratio) at all polling stations",
                            "**Wide Doorways**: Minimum 90cm width for wheelchair access",
                            "**Wheelchairs Available**: Polling stations provide wheelchairs",
                            "**Reserved Parking**: Designated parking near entrance",
                            "**Accessible Toilets**: Wheelchair-accessible toilets at polling locations",
                        ],
                    },
                    {
                        title: "Voting Assistance",
                        items: [
                            "**Table-Mounted EVMs**: For wheelchair users who cannot reach standard EVM height",
                            "**Staff Assistance**: Trained staff to help with EVM operation if needed",
                            "**Priority Entry**: Separate queue to avoid long waiting",
                            "**Seating Arrangements**: Chairs available if you need to rest",
                            "**Companion Allowed**: Bring one person to assist you",
                        ],
                    },
                ],
            },
            companionRights: {
                title: "Companion/Assistant Rights",
                content: [
                    "You can bring ONE companion (18+ years) to assist you in voting.",
                ],
                subsections: [
                    {
                        title: "Companion Process",
                        items: [
                            "Inform Presiding Officer about companion assistance",
                            "Companion signs Form 14A (confidentiality declaration)",
                            "Companion can help you enter booth and operate EVM",
                            "Your vote remains secret",
                        ],
                    },
                ],
            },
            postalBallot: {
                title: "Postal Ballot Facility",
                content: [
                    "Eligible if you have 80%+ disability and cannot visit polling station.",
                ],
                subsections: [
                    {
                        title: "Application",
                        items: [
                            "Submit Form 12D at least 7 days before election",
                            "Attach disability certificate (80%+)",
                            "Provide current address",
                        ],
                    },
                    {
                        title: "Process",
                        items: [
                            "Ballot delivered to your home",
                            "Mark your choice and seal in envelope",
                            "Electoral officials collect from home or mail back",
                        ],
                    },
                ],
            },
            helplines: {
                title: "Helpline & Support Services",
                subsections: [
                    {
                        title: "Contact Numbers",
                        items: [
                            "National Voters' Helpline: 1950",
                            "Email: complaints@eci.gov.in",
                            "Voter Helpline App",
                        ],
                    },
                ],
            },
            specialProvisions: {
                title: "Special Provisions & Rights",
                subsections: [
                    {
                        title: "Special Facilities",
                        items: [
                            "Free transport to polling stations (in many areas)",
                            "Volunteers to assist from vehicle to booth",
                            "Priority voting to minimize physical strain",
                            "Home-based voting for severely disabled",
                        ],
                    },
                ],
            },
            governmentInitiatives: {
                title: "Recent Government Initiatives",
                content: [
                    "Accessible India Campaign ensuring all polling stations have ramps and accessible facilities",
                    "Model polling stations with enhanced accessibility",
                    "Regular accessibility audits",
                ],
            },
            yourRights: {
                title: "Know Your Rights",
                subsections: [
                    {
                        title: "Legal Rights",
                        items: [
                            "Article 326: Right to vote",
                            "RPWD Act 2016: Accessible voting facilities",
                            "Right to companion assistance",
                            "Right to complain if facilities not provided",
                        ],
                    },
                ],
            },
            preElectionChecklist: {
                title: "Pre-Election Checklist",
                subsections: [
                    {
                        title: "Preparation",
                        items: [
                            "✓ Verify electoral roll",
                            "✓ Check polling station accessibility",
                            "✓ Apply for postal ballot if needed",
                            "✓ Arrange companion if required",
                            "✓ Plan accessible transport",
                            "✓ Keep documents ready",
                        ],
                    },
                ],
            },
            contacts: {
                title: "Contact & Support",
                subsections: [
                    {
                        title: "Key Contacts",
                        items: [
                            "District Election Officer",
                            "Booth Level Officer",
                            "Nodal Officer for PwD",
                            "Disability rights organizations",
                        ],
                    },
                ],
            },
        },
    },
    // Additional categories follow similar structure...
    {
        id: "hearing",
        name: "Hearing Impairment / Deafness",
        icon: "👂",
        description: "For persons with complete deafness or hard of hearing",
        info: {
            registration: {
                title: "Registration & Documentation",
                content: ["Register with disability marking for appropriate communication support."],
                subsections: [
                    {
                        title: "Documents & Process",
                        items: [
                            "Disability certificate, ID proof, address proof",
                            "Register online at www.nvsp.in or through ERO",
                        ],
                    },
                ],
            },
            pollingFacilities: {
                title: "Voting Facilities",
                subsections: [
                    {
                        title: "Communication Support",
                        items: [
                            "**Sign Language Interpreters**: Available on request at polling stations",
                            "**Visual Instructions**: Clear signage and written instructions",
                            "**Written Communication**: Polling staff trained to communicate in writing",
                            "**Video Instructions**: Some stations have video guides with subtitles",
                        ],
                    },
                ],
            },
            companionRights: {
                title: "Companion Rights",
                content: ["You can bring a companion who knows sign language to assist you."],
            },
            postalBallot: {
                title: "Postal Ballot",
                content: ["Available if 80%+ disability prevents polling station visit."],
            },
            helplines: {
                title: "Helplines",
                content: [
                    "National Helpline: 1950 (SMS facility available)",
                    "Email: complaints@eci.gov.in",
                ],
            },
            specialProvisions: {
                title: "Special Provisions",
                content: [
                    "Visual voter slips with clear instructions",
                    "Priority entry",
                    "Patient and supportive staff",
                ],
            },
            governmentInitiatives: {
                title: "Government Initiatives",
                content: ["Training for polling staff in basic sign language", "Visual communication materials"],
            },
            yourRights: {
                title: "Your Rights",
                content: ["Right to accessible communication", "Right to sign language interpreter"],
            },
            preElectionChecklist: {
                title: "Checklist",
                content: [
                    "Request sign language interpreter in advance",
                    "Verify polling station has visual instructions",
                ],
            },
            contacts: {
                title: "Contacts",
                content: ["District Election Officer", "Deaf associations in your area"],
            },
        },
    },
    {
        id: "speech",
        name: "Speech and Language Disability",
        icon: "🗣️",
        description: "For persons with speech impairment or communication disorders",
        info: {
            registration: {
                title: "Registration",
                content: ["Standard registration process with disability marking."],
            },
            pollingFacilities: {
                title: "Facilities",
                content: [
                    "Written communication accepted",
                    "Patient polling staff",
                    "No verbal communication required for voting",
                ],
            },
            companionRights: {
                title: "Companion Rights",
                content: ["Companion can help communicate with polling staff if needed."],
            },
            postalBallot: {
                title: "Postal Ballot",
                content: ["Available if 80%+ disability."],
            },
            helplines: {
                title: "Helplines",
                content: ["1950 (SMS/Email preferred)", "complaints@eci.gov.in"],
            },
            specialProvisions: {
                title: "Special Provisions",
                content: ["Written instructions", "No verbal requirements"],
            },
            governmentInitiatives: {
                title: "Initiatives",
                content: ["Staff training on communication disorders"],
            },
            yourRights: {
                title: "Rights",
                content: ["Right to non-verbal communication"],
            },
            preElectionChecklist: {
                title: "Checklist",
                content: ["Prepare written communication if needed"],
            },
            contacts: {
                title: "Contacts",
                content: ["District Election Officer"],
            },
        },
    },
    {
        id: "intellectual",
        name: "Intellectual Disabilities",
        icon: "🧠",
        description: "For persons with learning disabilities or specific learning disabilities",
        info: {
            registration: {
                title: "Registration",
                content: ["Register with disability certificate for supportive assistance."],
            },
            pollingFacilities: {
                title: "Facilities",
                subsections: [
                    {
                        title: "Supportive Environment",
                        items: [
                            "Simple, clear instructions",
                            "Patient and supportive staff",
                            "Extra time if needed",
                            "Visual aids for understanding",
                            "Companion assistance allowed",
                        ],
                    },
                ],
            },
            companionRights: {
                title: "Companion Rights",
                content: ["Companion can help explain the voting process and assist."],
            },
            postalBallot: {
                title: "Postal Ballot",
                content: ["Available if 80%+ disability."],
            },
            helplines: {
                title: "Helplines",
                content: ["1950", "Family members can call on behalf"],
            },
            specialProvisions: {
                title: "Special Provisions",
                content: ["Simplified instructions", "No time pressure", "Supportive environment"],
            },
            governmentInitiatives: {
                title: "Initiatives",
                content: ["Staff training on intellectual disabilities", "Easy-to-understand materials"],
            },
            yourRights: {
                title: "Rights",
                content: ["Right to assistance", "Right to take time needed"],
            },
            preElectionChecklist: {
                title: "Checklist",
                content: ["Arrange companion", "Visit polling station beforehand if possible"],
            },
            contacts: {
                title: "Contacts",
                content: ["District Election Officer", "Intellectual disability organizations"],
            },
        },
    },
    {
        id: "mental",
        name: "Mental Health Conditions",
        icon: "💭",
        description: "For persons with mental illness or chronic neurological conditions",
        info: {
            registration: {
                title: "Registration",
                content: ["Register with disability certificate. Your voting rights are protected."],
            },
            pollingFacilities: {
                title: "Facilities",
                content: [
                    "Calm, supportive environment",
                    "Patient staff",
                    "Companion assistance",
                    "Priority entry to reduce stress",
                ],
            },
            companionRights: {
                title: "Companion Rights",
                content: ["Companion can provide emotional support and assistance."],
            },
            postalBallot: {
                title: "Postal Ballot",
                content: ["Available if 80%+ disability or if visiting polling station causes distress."],
            },
            helplines: {
                title: "Helplines",
                content: ["1950", "Caregivers can call on behalf"],
            },
            specialProvisions: {
                title: "Special Provisions",
                content: ["Supportive environment", "No pressure", "Privacy maintained"],
            },
            governmentInitiatives: {
                title: "Initiatives",
                content: ["Mental health awareness training for staff"],
            },
            yourRights: {
                title: "Rights",
                content: ["Right to vote with dignity", "Right to assistance", "Confidentiality maintained"],
            },
            preElectionChecklist: {
                title: "Checklist",
                content: ["Arrange companion", "Consider postal ballot option", "Plan for comfortable timing"],
            },
            contacts: {
                title: "Contacts",
                content: ["District Election Officer", "Mental health organizations"],
            },
        },
    },
    {
        id: "multiple",
        name: "Multiple Disabilities",
        icon: "🤝",
        description: "For persons with combination of two or more disabilities",
        info: {
            registration: {
                title: "Registration",
                content: ["Register with all disabilities listed on certificate for comprehensive support."],
            },
            pollingFacilities: {
                title: "Facilities",
                content: [
                    "All relevant facilities based on your specific disabilities",
                    "Customized assistance",
                    "Maximum support provided",
                ],
            },
            companionRights: {
                title: "Companion Rights",
                content: ["Companion assistance strongly recommended and supported."],
            },
            postalBallot: {
                title: "Postal Ballot",
                content: ["Highly recommended if 80%+ disability. Home voting facilitation available."],
            },
            helplines: {
                title: "Helplines",
                content: ["1950 - Priority assistance", "Dedicated support for multiple disabilities"],
            },
            specialProvisions: {
                title: "Special Provisions",
                content: [
                    "Comprehensive accessibility",
                    "Home-based voting priority",
                    "Maximum assistance allowed",
                ],
            },
            governmentInitiatives: {
                title: "Initiatives",
                content: ["Special focus on voters with multiple disabilities", "Enhanced support systems"],
            },
            yourRights: {
                title: "Rights",
                content: ["All rights applicable to each of your disabilities", "Maximum support guaranteed"],
            },
            preElectionChecklist: {
                title: "Checklist",
                content: [
                    "Strongly consider postal ballot",
                    "Arrange companion",
                    "Contact DEO for customized arrangements",
                ],
            },
            contacts: {
                title: "Contacts",
                content: ["District Election Officer (priority contact)", "Multiple disability organizations"],
            },
        },
    },
    {
        id: "age-related",
        name: "Age-Related Disabilities",
        icon: "👴",
        description: "For senior citizens with mobility issues or age-related impairments",
        info: {
            registration: {
                title: "Registration",
                content: [
                    "Senior citizens (80+ years) with mobility issues can register for special facilities.",
                ],
            },
            pollingFacilities: {
                title: "Facilities",
                subsections: [
                    {
                        title: "Senior Citizen Support",
                        items: [
                            "Priority entry and voting",
                            "Seating arrangements",
                            "Wheelchairs available",
                            "Staff assistance",
                            "Companion allowed",
                        ],
                    },
                ],
            },
            companionRights: {
                title: "Companion Rights",
                content: ["Family member or caregiver can assist."],
            },
            postalBallot: {
                title: "Postal Ballot",
                content: [
                    "Senior citizens 80+ years eligible for postal ballot",
                    "Home collection of ballot available",
                ],
            },
            helplines: {
                title: "Helplines",
                content: ["1950", "Family members can call on behalf"],
            },
            specialProvisions: {
                title: "Special Provisions",
                content: [
                    "Home-based voting for 80+ with mobility issues",
                    "Free transport in many areas",
                    "Priority treatment",
                ],
            },
            governmentInitiatives: {
                title: "Initiatives",
                content: ["Special focus on elderly voters", "Home voting facilities"],
            },
            yourRights: {
                title: "Rights",
                content: ["Right to postal ballot (80+)", "Right to assistance", "Priority voting"],
            },
            preElectionChecklist: {
                title: "Checklist",
                content: ["Apply for postal ballot if 80+", "Arrange transport", "Keep ID ready"],
            },
            contacts: {
                title: "Contacts",
                content: ["District Election Officer", "Senior citizen welfare organizations"],
            },
        },
    },
];
