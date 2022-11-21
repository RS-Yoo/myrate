﻿
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;

using System.Xml.Linq;
using myrate_backend.Areas.Data;
/**
* Authors:   Alyse  Palsulich, Nicholas Gonzalez
* Date:      11-16-2022
* Course:    CS 4500, University of Utah, School of Computing
* Copyright: CS 4500 and Alyse Palsulich, Nicholas Gonzalez, Justin Springborn, and Rosemary Yoo - This work may not be copied for use in Academic Coursework.
*
* I, Alyse Palsulich, Nicholas Gonzalez, Justin Springborn, and Rosemary Yoo,
* certify that I wrote this code from scratch and did not copy it in part or 
* whole from another source. Any references used in the completion of the assignment 
* are cited in my README file and in the appropriate method header.
*
* File Contents
* Base model class for Ratings.
*/
namespace myrate_backend.Models
{
    public class Rating
    {
        public int Id { get; set; }
        
        [Display(Name = "Star Rating")]
        [Range(0, 5)]
        public float? Stars { get; set; } //0-5
        [Display(Name = "Written Review")]
        public string? Review { get; set; }
        public MyRateUser User { get; set; }
    }
}
